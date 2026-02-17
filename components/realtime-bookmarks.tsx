'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { Bookmark, Trash2, ExternalLink, Search } from 'lucide-react'
import { deleteBookmark } from '@/app/actions'
import { motion, AnimatePresence } from 'framer-motion'

type BookmarkItem = {
    id: string
    title: string
    url: string
    category?: string
}

const CATEGORIES = ['All', 'General', 'Work', 'Personal', 'Learning', 'Tools']

const supabase = createClient()

export default function RealtimeBookmarks({ serverBookmarks }: { serverBookmarks: BookmarkItem[] }) {
    const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(serverBookmarks)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')

    useEffect(() => {
        setBookmarks(serverBookmarks)
    }, [serverBookmarks])

    useEffect(() => {
        let retryTimeout: NodeJS.Timeout
        let retryCount = 0

        const subscribe = () => {
            console.log(`Setting up real-time subscription (Attempt ${retryCount + 1})...`)

            const channel = supabase
                .channel(`realtime-bookmarks-${Date.now()}`)
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'bookmarks',
                    },
                    (payload) => {
                        console.log('Real-time payload received:', payload)
                        if (payload.eventType === 'INSERT') {
                            const newBookmark = payload.new as BookmarkItem
                            setBookmarks((prev) => {
                                // Performance: Use a Set for faster lookup if list gets large, 
                                // but for bookmarks, a simple some() is fine.
                                if (prev.some(b => b.id === newBookmark.id)) return prev
                                return [...prev, newBookmark]
                            })
                        } else if (payload.eventType === 'DELETE') {
                            setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== payload.old.id))
                        }
                    }
                )
                .subscribe((status) => {
                    console.log('Real-time subscription status:', status)

                    if (status === 'TIMED_OUT' || status === 'CLOSED') {
                        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000)
                        console.log(`Connection failed. Retrying in ${delay}ms...`)
                        retryCount++
                        retryTimeout = setTimeout(() => {
                            supabase.removeChannel(channel)
                            subscribe()
                        }, delay)
                    } else if (status === 'SUBSCRIBED') {
                        retryCount = 0
                    }
                })

            return channel
        }

        const channel = subscribe()

        return () => {
            console.log('Cleaning up real-time subscription')
            clearTimeout(retryTimeout)
            supabase.removeChannel(channel)
        }
    }, [])

    const handleDelete = async (id: string) => {
        setBookmarks((prev) => prev.filter((b) => b.id !== id))
        const result = await deleteBookmark(id)
        if (result?.error) {
            console.error(result.error)
        }
    }

    const filteredBookmarks = bookmarks.filter((bookmark) => {
        const matchesSearch = bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bookmark.url.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === 'All' || bookmark.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search bookmarks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-200 shadow-sm"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === category
                                ? 'bg-indigo-600 text-white shadow-md transform scale-105'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <motion.div layout className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {filteredBookmarks.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="text-center py-12"
                            key="empty-state"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 mb-4">
                                <Bookmark className="h-8 w-8 text-indigo-600" />
                            </div>
                            <p className="text-gray-500 text-lg">
                                {searchQuery || selectedCategory !== 'All'
                                    ? "No bookmarks match your search."
                                    : "No bookmarks yet. Add your first one!"}
                            </p>
                        </motion.div>
                    ) : (
                        filteredBookmarks.map((bookmark) => (
                            <motion.div
                                key={bookmark.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="group relative bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg hover:border-indigo-300 transition-all duration-300"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4 flex-1 min-w-0">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                                            <Bookmark className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <a
                                                    href={bookmark.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-base font-semibold text-gray-900 hover:text-indigo-600 transition-colors duration-200 flex items-center gap-2 group/link truncate"
                                                >
                                                    <span className="truncate">{bookmark.title}</span>
                                                    <ExternalLink className="h-4 w-4 text-gray-400 group-hover/link:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                                                </a>
                                                {bookmark.category && (
                                                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider">
                                                        {bookmark.category}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 truncate">{bookmark.url}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(bookmark.id)}
                                        className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                                        aria-label="Delete bookmark"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}
