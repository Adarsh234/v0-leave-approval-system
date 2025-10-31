import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseUrl, getSupabaseHeaders } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1️⃣ Ensure ID is received
    const leaveRequestId = params?.id
    if (!leaveRequestId || leaveRequestId === 'undefined') {
      console.error('❌ Missing or invalid leaveRequestId:', leaveRequestId)
      return NextResponse.json(
        { error: 'Missing or invalid leave request ID', id: leaveRequestId },
        { status: 400 }
      )
    }

    const supabaseUrl = getSupabaseUrl()
    const headers = getSupabaseHeaders()

    // 2️⃣ Extract Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - missing Bearer token' },
        { status: 401 }
      )
    }
    const authToken = authHeader.substring(7)
    headers.Authorization = `Bearer ${authToken}`

    // 3️⃣ Verify current user
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

    // 4️⃣ Update status to rejected
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
      console.error('❌ Supabase reject update failed:', text)
      return NextResponse.json(
        { error: 'Failed to update leave request', details: text },
        { status: 500 }
      )
    }

    const updatedData = await updateRes.json()
    console.log('✅ Rejected leave request:', updatedData)

    return NextResponse.json({
      success: true,
      message: 'Leave request rejected successfully',
      data: updatedData,
    })
  } catch (err: any) {
    console.error('💥 Error in reject route:', err)
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    )
  }
}
