// app/api/leave-requests/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseHeaders, getSupabaseUrl } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = getSupabaseUrl()
    const headers = getSupabaseHeaders()

    // 1️⃣ Get auth token
    const authHeader = request.headers.get("authorization")
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const authToken = authHeader.replace("Bearer ", "")
    headers.Authorization = `Bearer ${authToken}`
    headers["Content-Type"] = "application/json"
    headers["Prefer"] = "return=representation" // return the inserted row

    // 2️⃣ Verify user
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, { headers })
    if (!userRes.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await userRes.json()
    const userId = user.id

    // 3️⃣ Get request body
    const body = await request.json()
    const { leaveTypeId, startDate, endDate, reason } = body

    if (!leaveTypeId || !startDate || !endDate || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // 4️⃣ Get user details (to assign manager)
    const userDetailsRes = await fetch(
      `${supabaseUrl}/rest/v1/users?id=eq.${userId}&select=manager_id,full_name,email`,
      { headers }
    )
    const userDetails = await userDetailsRes.json()
    const userDetail = userDetails[0]
    if (!userDetail) return NextResponse.json({ error: "User not found" }, { status: 404 })

    // 5️⃣ Insert leave request
    const createRes = await fetch(`${supabaseUrl}/rest/v1/leave_requests`, {
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

    if (!createRes.ok) {
      const err = await createRes.json()
      return NextResponse.json({ error: err.message || "Failed to create leave request" }, { status: 400 })
    }

    const leaveRequest = await createRes.json()

    // 6️⃣ Optional: notify manager
    if (userDetail.manager_id) {
      const managerRes = await fetch(
        `${supabaseUrl}/rest/v1/users?id=eq.${userDetail.manager_id}&select=email,full_name`,
        { headers }
      )
      const managers = await managerRes.json()
      const manager = managers[0]
      if (manager) {
        console.log(`[v0] Notify manager ${manager.email} of new leave request`)
      }
    }

    return NextResponse.json(leaveRequest, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating leave request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
