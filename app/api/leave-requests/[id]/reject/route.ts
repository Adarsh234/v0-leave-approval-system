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

    // Manual auth: Get token from Authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const authToken = authHeader.replace('Bearer ', '')
    headers.Authorization = `Bearer ${authToken}`

    // Validate user via Supabase auth endpoint
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, { headers })
    const userData = await userRes.json()
    if (!userRes.ok || !userData?.id) {
      console.error('User validation failed:', userRes.status, userData)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const managerId = userData.id

    // Reject leave request
    const rejectRes = await fetch(
      `${supabaseUrl}/rest/v1/leave_requests?id=eq.${requestId}`,
      {
        method: 'PATCH',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify({ status: 'rejected' }),
      }
    )

    const rejectData = await rejectRes.json()
    if (!rejectRes.ok) {
      console.error(
        'Failed to reject leave request:',
        rejectRes.status,
        rejectData
      )
      return NextResponse.json(
        { error: 'Failed to reject request', details: rejectData },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: rejectData })
  } catch (error) {
    console.error('Internal server error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
