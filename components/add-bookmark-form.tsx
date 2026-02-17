'use client'

import { addBookmark } from '@/app/actions'
import { Plus } from 'lucide-react'
import { useRef } from 'react'

export default function AddBookmarkForm() {
    const formRef = useRef<HTMLFormElement>(null)

    return (
        <form
            className="flex gap-3"
            action={async (formData) => {
                await addBookmark(formData)
                formRef.current?.reset()
            }}
            ref={formRef}
        >
            <div className="flex-1 flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    name="title"
                    placeholder="Bookmark Title"
                    required
                    className="flex-1 appearance-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                />
                <input
                    type="url"
                    name="url"
                    placeholder="https://example.com"
                    required
                    className="flex-1 appearance-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                />
                <select
                    name="category"
                    required
                    defaultValue="General"
                    className="appearance-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 bg-white"
                >
                    <option value="General">General</option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Learning">Learning</option>
                    <option value="Tools">Tools</option>
                </select>
            </div>
            <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
            >
                <Plus className="h-5 w-5 mr-1" />
                Add
            </button>
        </form>
    )
}
