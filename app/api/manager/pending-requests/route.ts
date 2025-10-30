import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseHeaders, getSupabaseUrl } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = getSupabaseUrl()

    // ✅ 1. Extract Bearer token (manual auth)
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing token' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const headers = getSupabaseHeaders(token)

    // ✅ 2. Verify current manager user
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, { headers })
    if (!userRes.ok) {
      const errText = await userRes.text()
      console.error('[pending-requests] Invalid token:', errText)
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token', details: errText },
        { status: 401 }
      )
    }

    const userData = await userRes.json()
    const managerId = userData.id

    // ✅ 3. Fetch pending leave requests for this manager
    const requestsRes = await fetch(
      `${supabaseUrl}/rest/v1/leave_requests?manager_id=eq.${managerId}&status=eq.pending&order=requested_at.desc`,
      { headers }
    )

    if (!requestsRes.ok) {
      const errText = await requestsRes.text()
      console.error('[pending-requests] Failed to fetch requests:', errText)
      return NextResponse.json(
        { error: 'Failed to fetch requests', details: errText },
        { status: 500 }
      )
    }

    const requests = await requestsRes.json()
    console.log(
      `[pending-requests] Found ${requests.length} pending requests for manager ${managerId}`
    )

    // ✅ 4. Enrich each request with user and leave type info
    const enrichedRequests = await Promise.all(
      requests.map(async (req: any) => {
        try {
          const [userRes, leaveTypeRes] = await Promise.all([
            fetch(
              `${supabaseUrl}/rest/v1/users?id=eq.${req.user_id}&select=full_name,email`,
              { headers }
            ),
            fetch(
              `${supabaseUrl}/rest/v1/leave_types?id=eq.${req.leave_type_id}&select=name`,
              { headers }
            ),
          ])

          const [user] = userRes.ok ? await userRes.json() : [null]
          const [leaveType] = leaveTypeRes.ok
            ? await leaveTypeRes.json()
            : [null]

          return {
            ...req,
            users: user || null,
            leave_types: leaveType || null,
          }
        } catch (nestedErr) {
          console.error('[pending-requests] Nested fetch error:', nestedErr)
          return req
        }
      })
    )

    // ✅ 5. Send response
    return NextResponse.json(enrichedRequests)
  } catch (error) {
    console.error('[pending-requests] Internal error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
