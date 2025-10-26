import { createClient as createSupabaseClient } from "@supabase/supabase-js"

let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null

export function createClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error("Missing Supabase environment variables")
  }

  supabaseClient = createSupabaseClient(url, key)
  return supabaseClient
}
