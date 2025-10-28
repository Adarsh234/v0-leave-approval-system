import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseHeaders, getSupabaseUrl } from "@/lib/supabase/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabaseUrl = getSupabaseUrl()
    const headers = getSupabaseHeaders()

    // ✅ Get Supabase access token from Authorization header
    const authHeader = request.headers.get("authorization")
    const authToken = authHeader?.replace("Bearer ", "")

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized - Missing token" }, { status: 401 })
    }

    headers.Authorization = `Bearer ${authToken}`

    // ✅ Verify user identity via Supabase Auth API
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, { headers })

    if (!userResponse.ok) {
      return NextResponse.json({ error: "Unauthorized - Invalid token" }, { status: 401 })
    }

    const user = await userResponse.json()

    // ✅ Get request ID
    const { id } = params

    // Fetch leave request details
    const leaveRequestResponse = await fetch(
      `${supabaseUrl}/rest/v1/leave_requests?id=eq.${id}&select=*,users:user_id(email,full_name),leave_types(name)`,
      { headers },
    )

    if (!leaveRequestResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch leave request" }, { status: 400 })
    }

    const leaveRequests = await leaveRequestResponse.json()
    const leaveRequest = leaveRequests[0]

    if (!leaveRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    // ✅ Approve leave request
    const updateResponse = await fetch(`${supabaseUrl}/rest/v1/leave_requests?id=eq.${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        status: "approved",
        manager_reviewed_at: new Date().toISOString(),
        reviewed_by: user.id || null,
      }),
    })

    if (!updateResponse.ok) {
      const error = await updateResponse.json()
      return NextResponse.json({ error: error.message || "Failed to update request" }, { status: 400 })
    }

    // ✅ Optional: log or trigger notification
    console.log(`[INFO] Leave request ${id} approved by manager ${user.email}`)

    return NextResponse.json({ success: true, message: "Leave request approved successfully" })
  } catch (error) {
    console.error("[ERROR] Approving leave request failed:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
