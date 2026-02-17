'use client'

import { createClient } from '@/utils/supabase/client'
import { redirect } from 'next/navigation'
import { signOut } from './auth/actions'
import { LogOut } from 'lucide-react'
import AddBookmarkForm from '@/components/add-bookmark-form'
import RealtimeBookmarks from '@/components/realtime-bookmarks'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()

      const { data: { user: userData } } = await supabase.auth.getUser()

      if (!userData) {
        redirect('/login')
        return
      }

      setUser(userData)

      const { data } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: true })

      setBookmarks(data || [])
      setLoading(false)
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50"
    >
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-white/80 backdrop-blur-md shadow-sm border-b border-indigo-100 sticky top-0 z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <motion.div
                  className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </motion.div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Smart Bookmarks</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden sm:block">{user?.email}</span>
              <form action={signOut}>
                <motion.button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </motion.nav>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
            <h3 className="text-2xl font-bold text-white">Your Bookmarks</h3>
            <p className="mt-2 text-indigo-100">Manage your personal bookmarks securely.</p>
          </div>

          <div className="px-6 py-6">
            <AddBookmarkForm />

            <div className="mt-8 border-t border-gray-200 pt-6">
              <RealtimeBookmarks serverBookmarks={bookmarks} />
            </div>
          </div>
        </motion.div>
      </main>
    </motion.div>
  )
}
