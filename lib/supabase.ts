import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured) {
    console.warn("Supabase Environment Variables missing. Using placeholder client (Mock Mode).");
}

// Fallback to dummy values to prevent crash during build/runtime if keys are missing
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
)
