import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseUrl, getSupabaseHeaders } from '@/lib/supabase/server'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabaseUrl = getSupabaseUrl()
    const headers = getSupabaseHeaders()

    const requestId = params.id

    // ✅ Manual auth: Get token from Authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const authToken = authHeader.replace('Bearer ', '')
    headers.Authorization = `Bearer ${authToken}`

    // ✅ Validate user via Supabase auth endpoint
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, { headers })
    if (!userRes.ok) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userData = await userRes.json()
    const managerId = userData.id

    // ✅ Update the leave request to "rejected" (manual Supabase REST call)
    const rejectRes = await fetch(
      `${supabaseUrl}/rest/v1/leave_requests?id=eq.${requestId}`,
      {
        method: 'PATCH',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          Prefer: 'return=representation', // to get updated row
        },
        body: JSON.stringify({ status: 'rejected' }),
      }
    )

    if (!rejectRes.ok) {
      const errText = await rejectRes.text()
      console.error('[v0] Failed to reject leave request:', errText)
      return NextResponse.json(
        { error: 'Failed to reject request' },
        { status: 500 }
      )
    }

    const updatedRequest = await rejectRes.json()
    return NextResponse.json({ success: true, data: updatedRequest })
  } catch (error) {
    console.error('[v0] Internal server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
