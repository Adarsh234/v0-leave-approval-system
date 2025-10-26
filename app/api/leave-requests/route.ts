import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseHeaders, getSupabaseUrl } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = getSupabaseUrl()
    const headers = getSupabaseHeaders()

    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const authToken = authHeader.replace("Bearer ", "")
    headers.Authorization = `Bearer ${authToken}`

    // Get user from auth
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, { headers })

    if (!userResponse.ok) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userData = await userResponse.json()
    const userId = userData.id

    const body = await request.json()
    const { leaveTypeId, startDate, endDate, reason } = body

    // Get user details
    const userDetailsResponse = await fetch(
      `${supabaseUrl}/rest/v1/users?id=eq.${userId}&select=manager_id,full_name,email`,
      { headers },
    )

    const userDetails = await userDetailsResponse.json()
    const userDetail = userDetails[0]

    if (!userDetail) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create leave request
    const createResponse = await fetch(`${supabaseUrl}/rest/v1/leave_requests`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        user_id: userId,
        leave_type_id: leaveTypeId,
        start_date: startDate,
        end_date: endDate,
        reason,
        manager_id: userDetail.manager_id,
        status: "pending",
      }),
    })

    if (!createResponse.ok) {
      const error = await createResponse.json()
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const leaveRequest = await createResponse.json()

    // Get manager details for email notification
    if (userDetail.manager_id) {
      const managerResponse = await fetch(
        `${supabaseUrl}/rest/v1/users?id=eq.${userDetail.manager_id}&select=email,full_name`,
        { headers },
      )

      const managers = await managerResponse.json()
      const manager = managers[0]

      if (manager) {
        console.log(`[v0] Manager ${manager.email} should be notified of leave request`)
      }
    }

    return NextResponse.json(leaveRequest, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating leave request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
