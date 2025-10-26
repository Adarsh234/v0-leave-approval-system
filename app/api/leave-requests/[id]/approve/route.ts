import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseHeaders, getSupabaseUrl } from "@/lib/supabase/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabaseUrl = getSupabaseUrl()
    const headers = getSupabaseHeaders()

    const authToken = request.cookies.get("sb-access-token")?.value

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    headers.Authorization = `Bearer ${authToken}`

    // Get user from auth
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, { headers })

    if (!userResponse.ok) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    // Get leave request details
    const leaveRequestResponse = await fetch(
      `${supabaseUrl}/rest/v1/leave_requests?id=eq.${id}&select=*,users:user_id(email,full_name),leave_types(name)`,
      { headers },
    )

    const leaveRequests = await leaveRequestResponse.json()
    const leaveRequest = leaveRequests[0]

    if (!leaveRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    // Update leave request status
    const updateResponse = await fetch(`${supabaseUrl}/rest/v1/leave_requests?id=eq.${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        status: "approved",
        manager_reviewed_at: new Date().toISOString(),
      }),
    })

    if (!updateResponse.ok) {
      const error = await updateResponse.json()
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Send approval notification
    console.log(`[v0] Employee ${leaveRequest.users[0]?.email} should be notified of approval`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error approving leave request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
