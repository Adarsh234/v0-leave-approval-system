// app/api/stats/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseHeaders, getSupabaseUrl } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = getSupabaseUrl()

    // 🧠 Extract Bearer token
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing token' },
        { status: 401 }
      )
    }

    const authToken = authHeader.replace('Bearer ', '')
    const headers = getSupabaseHeaders(authToken)

    // 🧠 Verify user
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, { headers })
    if (!userResponse.ok) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      )
    }

    const userData = await userResponse.json()
    const userId = userData.id

    // 🧠 Fetch profile
    const profileResponse = await fetch(
      `${supabaseUrl}/rest/v1/users?id=eq.${userId}&select=role,full_name,department_id`,
      { headers }
    )
    const [userProfile] = await profileResponse.json()

    // 🧠 Fetch leave records
    const leaveRecordsResponse = await fetch(
      `${supabaseUrl}/rest/v1/leave_records?user_id=eq.${userId}&select=*`,
      { headers }
    )
    const leaveRecords = await leaveRecordsResponse.json()

    // 🧠 Fetch pending requests by role
    let pendingRequests = []
    if (userProfile?.role === 'manager') {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/leave_requests?manager_id=eq.${userId}&status=eq.pending&select=*`,
        { headers }
      )
      pendingRequests = await res.json()
    } else if (userProfile?.role === 'coordinator') {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/leave_requests?status=eq.pending&select=*`,
        { headers }
      )
      pendingRequests = await res.json()
    } else {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/leave_requests?user_id=eq.${userId}&status=eq.pending&select=*`,
        { headers }
      )
      pendingRequests = await res.json()
    }

    return NextResponse.json({
      role: userProfile?.role,
      name: userProfile?.full_name,
      leaveBalance: leaveRecords || [],
      pendingRequests: pendingRequests || [],
    })
  } catch (error) {
    console.error('[v0] Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
