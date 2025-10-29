// app/api/leave-requests/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseHeaders, getSupabaseUrl } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = getSupabaseUrl()

    // 🧠 Extract auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing token' },
        { status: 401 }
      )
    }

    const authToken = authHeader.replace('Bearer ', '')
    const headers = getSupabaseHeaders(authToken)

    // 🧠 Get logged-in user
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, { headers })
    if (!userResponse.ok) {
      const text = await userResponse.text()
      console.error('[v0] Invalid auth token:', text)
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      )
    }

    const userData = await userResponse.json()
    const userId = userData.id

    // 🧠 Parse request body
    const body = await request.json()
    const { leave_type_id, start_date, end_date, reason } = body

    if (!leave_type_id || !start_date || !end_date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 🧠 Create leave request
    const leaveRequestResponse = await fetch(
      `${supabaseUrl}/rest/v1/leave_requests`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          user_id: userId,
          leave_type_id,
          start_date,
          end_date,
          reason,
          status: 'pending',
          requested_at: new Date().toISOString(),
        }),
      }
    )

    if (!leaveRequestResponse.ok) {
      const errorText = await leaveRequestResponse.text()
      console.error('[v0] Leave insert error:', errorText)
      return NextResponse.json(
        { error: 'Failed to submit leave request' },
        { status: 500 }
      )
    }

    const responseData = await leaveRequestResponse.json()
    return NextResponse.json({ success: true, data: responseData })
  } catch (error) {
    console.error('[v0] Error submitting leave request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
