import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseHeaders, getSupabaseUrl } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = getSupabaseUrl()
    const baseHeaders = getSupabaseHeaders()

    const authHeader = request.headers.get("Authorization")
    console.log("[v0] Auth header present:", !!authHeader)

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("[v0] No valid Authorization header found")
      return NextResponse.json({ error: "Unauthorized - no auth token" }, { status: 401 })
    }

    const authToken = authHeader.substring(7) // Remove "Bearer " prefix
    console.log("[v0] Auth token extracted:", authToken.substring(0, 20) + "...")

    // Create headers with auth token
    const headers = {
      ...baseHeaders,
      Authorization: `Bearer ${authToken}`,
    }

    // Fetch user data from auth
    console.log("[v0] Fetching user data from auth...")
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers,
    })

    console.log("[v0] User response status:", userResponse.status)

    if (!userResponse.ok) {
      const errorText = await userResponse.text()
      console.log("[v0] User fetch error:", errorText)
      return NextResponse.json({ error: "Unauthorized - invalid token" }, { status: 401 })
    }

    const userData = await userResponse.json()
    const userId = userData.id

    console.log("[v0] User ID:", userId)

    // Fetch user profile
    console.log("[v0] Fetching user profile...")
    const profileResponse = await fetch(
      `${supabaseUrl}/rest/v1/users?id=eq.${userId}&select=role,full_name,department_id`,
      { headers },
    )

    console.log("[v0] Profile response status:", profileResponse.status)

    const profiles = await profileResponse.json()
    const userProfile = profiles[0] || {}

    console.log("[v0] User profile:", userProfile)

    // Fetch leave records
    console.log("[v0] Fetching leave records...")
    const leaveRecordsResponse = await fetch(`${supabaseUrl}/rest/v1/leave_records?user_id=eq.${userId}&select=*`, {
      headers,
    })

    const leaveRecords = await leaveRecordsResponse.json()
    console.log("[v0] Leave records:", leaveRecords)

    let pendingRequests: any[] = []

    if (userProfile?.role === "manager") {
      // Managers see requests they need to approve
      console.log("[v0] Fetching pending requests for manager approval...")
      const managerPendingResponse = await fetch(
        `${supabaseUrl}/rest/v1/leave_requests?manager_id=eq.${userId}&status=eq.pending&select=*`,
        { headers },
      )
      pendingRequests = await managerPendingResponse.json()
      console.log("[v0] Manager pending requests:", pendingRequests)
    } else if (userProfile?.role === "coordinator") {
      // Coordinators see all pending requests
      console.log("[v0] Fetching all pending requests for coordinator...")
      const coordinatorPendingResponse = await fetch(
        `${supabaseUrl}/rest/v1/leave_requests?status=eq.pending&select=*`,
        { headers },
      )
      pendingRequests = await coordinatorPendingResponse.json()
      console.log("[v0] Coordinator pending requests:", pendingRequests)
    } else {
      // Employees see their own pending requests
      console.log("[v0] Fetching employee pending requests...")
      const employeePendingResponse = await fetch(
        `${supabaseUrl}/rest/v1/leave_requests?user_id=eq.${userId}&status=eq.pending&select=*`,
        { headers },
      )
      pendingRequests = await employeePendingResponse.json()
      console.log("[v0] Employee pending requests:", pendingRequests)
    }

    return NextResponse.json({
      role: userProfile?.role,
      name: userProfile?.full_name,
      leaveBalance: Array.isArray(leaveRecords) ? leaveRecords : [],
      pendingRequests: Array.isArray(pendingRequests) ? pendingRequests : [],
    })
  } catch (error) {
    console.error("[v0] Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats", details: String(error) }, { status: 500 })
  }
}
