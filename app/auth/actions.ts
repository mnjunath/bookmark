'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getURL } from '@/utils/get-url'
import { headers } from 'next/headers'

export async function signInWithGoogle() {
    const supabase = await createClient()
    const host = (await headers()).get('host')
    const protocol = host?.includes('localhost') ? 'http' : 'https'
    const redirectTo = host
        ? `${protocol}://${host}/auth/callback`
        : `${getURL()}auth/callback`

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo,
        },
    })

    if (error) {
        console.error(error)
        return redirect('/login?message=Could not authenticate user')
    }

    return redirect(data.url)
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    return redirect('/login')
}
