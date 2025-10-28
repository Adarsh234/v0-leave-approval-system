import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseHeaders, getSupabaseUrl } from "@/lib/supabase/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabaseUrl = getSupabaseUrl()
    const headers = getSupabaseHeaders()

    // ✅ Get Authorization token from header (not cookie)
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      console.log("[DEBUG] Missing auth header")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const authToken = authHeader.replace("Bearer ", "")
    headers.Authorization = `Bearer ${authToken}`

    // ✅ Verify Supabase user
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, { headers })
    if (!userResponse.ok) {
      console.log("[DEBUG] Invalid Supabase token")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userData = await userResponse.json()
    const managerId = userData.id

    // ✅ Log everything for debugging
    const { id } = params
    console.log(`[DEBUG] Manager ${managerId} approving leave request ${id}`)

    // ✅ Update leave request status
    const updateBody = {
      status: "approved",
      manager_reviewed_at: new Date().toISOString(),
    }

    const updateResponse = await fetch(`${supabaseUrl}/rest/v1/leave_requests?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        ...headers,
        "Content-Type": "application/json",
        Prefer: "return=minimal", // Prevent extra response payload
      },
      body: JSON.stringify(updateBody),
    })

    // ✅ If Supabase rejects it, show the detailed error
    if (!updateResponse.ok) {
      const errorText = await updateResponse.text()
      console.error("[DEBUG] Supabase update error:", errorText)
      return NextResponse.json({ error: "Failed to update leave request", details: errorText }, { status: 400 })
    }

    console.log("[DEBUG] Leave request approved successfully.")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error approving leave request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
