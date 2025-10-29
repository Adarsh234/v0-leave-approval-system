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

    // 🧠 Get user info
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, { headers })
    if (!userResponse.ok) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      )
    }

    const userData = await userResponse.json()
    const managerId = userData.id

    console.log('[v0] Fetching pending requests for manager:', managerId)

    // 🧠 Fetch pending requests assigned to this manager
    const requestsResponse = await fetch(
      `${supabaseUrl}/rest/v1/leave_requests?manager_id=eq.${managerId}&status=eq.pending&order=requested_at.desc`,
      { headers }
    )

    if (!requestsResponse.ok) {
      console.error('[v0] Failed to fetch requests:', requestsResponse.status)
      return NextResponse.json(
        { error: 'Failed to fetch requests' },
        { status: 500 }
      )
    }

    const requests = await requestsResponse.json()
    console.log('[v0] Found pending requests:', requests.length)

    // 🧠 Fetch related data for each request
    const enrichedRequests = await Promise.all(
      requests.map(async (req: any) => {
        // Fetch user details
        const userRes = await fetch(
          `${supabaseUrl}/rest/v1/users?id=eq.${req.user_id}&select=full_name,email`,
          { headers }
        )
        const [user] = await userRes.json()

        // Fetch leave type
        const leaveRes = await fetch(
          `${supabaseUrl}/rest/v1/leave_types?id=eq.${req.leave_type_id}&select=name`,
          { headers }
        )
        const [leaveType] = await leaveRes.json()

        return {
          ...req,
          users: user || null,
          leave_types: leaveType || null,
        }
      })
    )

    return NextResponse.json(enrichedRequests)
  } catch (error) {
    console.error('[v0] Error fetching pending requests:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
