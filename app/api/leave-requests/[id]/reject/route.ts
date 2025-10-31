import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseUrl, getSupabaseHeaders } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const leaveRequestId = params.id // ✅ Extract ID properly
    if (!leaveRequestId) {
      return NextResponse.json(
        { error: 'Missing leave request ID' },
        { status: 400 }
      )
    }

    const supabaseUrl = getSupabaseUrl()
    const headers = getSupabaseHeaders()

    // ✅ Extract and verify auth token
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const authToken = authHeader.substring(7)
    headers.Authorization = `Bearer ${authToken}`

    // ✅ Get current user info
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, { headers })
    if (!userRes.ok) {
      const text = await userRes.text()
      return NextResponse.json(
        { error: 'Unauthorized', details: text },
        { status: 401 }
      )
    }
    const userData = await userRes.json()
    const userId = userData.id

    // ✅ Update leave request status
    const updateHeaders = {
      ...headers,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    }

    const updateRes = await fetch(
      `${supabaseUrl}/rest/v1/leave_requests?id=eq.${leaveRequestId}`,
      {
        method: 'PATCH',
        headers: updateHeaders,
        body: JSON.stringify({
          status: 'rejected',
          rejected_by: userId,
        }),
      }
    )

    if (!updateRes.ok) {
      const text = await updateRes.text()
      return NextResponse.json(
        { error: 'Failed to update leave request', details: text },
        { status: 500 }
      )
    }

    const updatedData = await updateRes.json()
    return NextResponse.json({
      success: true,
      message: 'Leave request approved',
      data: updatedData,
    })
  } catch (err: any) {
    console.error('Error approving request:', err)
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    )
  }
}
