import { createServerClient } from '@supabase/ssr'
import { createBrowserClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured) {
    console.warn("Supabase Environment Variables missing. Using placeholder client (Mock Mode).");
}

/**
 * Server-side Supabase client for Server Actions and Route Handlers.
 * Accesses cookies to maintain auth session.
 */
export const createSessionClient = async () => {
    if (!isSupabaseConfigured) {
        return createClient('https://placeholder.supabase.co', 'placeholder')
    }

    const cookieStore = await cookies()

    return createServerClient(
        supabaseUrl!,
        supabaseAnonKey!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}

/**
 * Client-side Supabase client for Client Components.
 */
export const createFrontendClient = () => {
    if (!isSupabaseConfigured) {
        return createClient('https://placeholder.supabase.co', 'placeholder')
    }

    return createBrowserClient(
        supabaseUrl!,
        supabaseAnonKey!
    )
}

export const createAdminClient = () => {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error("Supabase URL and Service Role Key are required for Admin operations.");
    }
    return createClient(supabaseUrl, serviceRoleKey);
}

export const getUser = async () => {
    const supabase = await createSessionClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}
