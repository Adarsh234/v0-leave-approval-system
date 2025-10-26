import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  // This refreshes a user's auth token
  try {
    await supabase.auth.getUser()
  } catch (error) {
    console.error("Auth refresh error:", error)
  }

  return supabaseResponse
}
