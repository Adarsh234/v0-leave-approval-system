import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseUrl, getSupabaseHeaders } from '@/lib/supabase/server'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabaseUrl = getSupabaseUrl()
    const headers = getSupabaseHeaders()

    const leaveRequestId = params.id

    // Get token from Authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const authToken = authHeader.replace('Bearer ', '')
    headers.Authorization = `Bearer ${authToken}`

    // Check user
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, { headers })
    const userData = await userRes.json()
    if (!userRes.ok || !userData?.id) {
      console.error('User validation failed:', userRes.status, userData)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // PATCH leave request
    const patchRes = await fetch(
      `${supabaseUrl}/rest/v1/leave_requests?id=eq.${leaveRequestId}`,
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

    const patchData = await patchRes.json()
    if (!patchRes.ok) {
      console.error('Supabase PATCH failed:', patchRes.status, patchData)
      return NextResponse.json(
        { error: 'Failed to reject request', details: patchData },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: patchData })
  } catch (error) {
    console.error('Internal error rejecting leave request:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
