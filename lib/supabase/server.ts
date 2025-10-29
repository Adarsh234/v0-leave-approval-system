import { createServerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export function createServerClientInstance() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // ✅ anon key is fine for server route validation
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}
