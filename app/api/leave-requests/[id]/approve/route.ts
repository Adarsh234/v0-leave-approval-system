import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseUrl, getSupabaseHeaders } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const parts = url.pathname.split('/')
    const leaveRequestId = parts.at(-2)

    if (!leaveRequestId || leaveRequestId === 'undefined') {
      console.error('❌ Missing or invalid leaveRequestId:', leaveRequestId)
      return NextResponse.json(
        { error: 'Missing or invalid leave request ID', id: leaveRequestId },
        { status: 400 }
      )
    }

    const supabaseUrl = getSupabaseUrl()
    const headers = getSupabaseHeaders()

    // 🔐 Get token
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing token' },
        { status: 401 }
      )
    }
    const authToken = authHeader.substring(7)
    headers.Authorization = `Bearer ${authToken}`

    // 🧠 Get user info (for manager id)
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, { headers })
    if (!userRes.ok) {
      const text = await userRes.text()
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token', details: text },
        { status: 401 }
      )
    }
    const userData = await userRes.json()
    const managerId = userData.id

    // 💬 Get optional comment
    let comment: string | null = null
    try {
      const body = await request.json()
      comment = body?.comment || null
    } catch {
      // ignore empty body
    }

    // 🧾 Prepare update data
    const updateData = {
      status: 'approved',
      manager_comment: comment || 'Approved by manager',
      manager_id: managerId,
      manager_reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // 🔄 Update record
    const response = await fetch(
      `${supabaseUrl}/rest/v1/leave_requests?id=eq.${leaveRequestId}`,
      {
        method: 'PATCH',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify(updateData),
      }
    )

    if (!response.ok) {
      const err = await response.text()
      console.error('❌ Supabase approve update failed:', err)
      return NextResponse.json(
        { error: 'Failed to approve request', details: err },
        { status: 500 }
      )
    }

    const data = await response.json()
    console.log('✅ Leave request approved successfully:', data)

    return NextResponse.json({
      success: true,
      message: 'Leave request approved successfully',
      data,
    })
  } catch (err: any) {
    console.error('💥 [approve] Internal error:', err)
    return NextResponse.json(
      { error: 'Internal server error', details: err.message || String(err) },
      { status: 500 }
    )
  }
}
