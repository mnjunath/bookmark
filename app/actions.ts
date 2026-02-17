'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addBookmark(formData: FormData) {
    const title = formData.get('title') as string
    const url = formData.get('url') as string
    const category = formData.get('category') as string
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase.from('bookmarks').insert({
        title,
        url,
        category,
        user_id: user.id,
    })

    if (error) {
        console.error('Error adding bookmark:', error)
        return { error: `Database error: ${error.message} (${error.code})` }
    }

    revalidatePath('/')
    return { success: true }
}

export async function deleteBookmark(id: string) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase.from('bookmarks').delete().match({ id, user_id: user.id })

    if (error) {
        console.error('Error deleting bookmark:', error)
        return { error: 'Failed to delete bookmark' }
    }

    revalidatePath('/')
    return { success: true }
}
