import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseUrl, getSupabaseHeaders } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    // 1️⃣ Extract the leaveRequestId manually from the URL
    const url = new URL(request.url)
    const parts = url.pathname.split('/')
    const leaveRequestId = parts.at(-2) // second last segment before "approve"

    if (!leaveRequestId || leaveRequestId === 'undefined') {
      console.error('❌ Missing or invalid leaveRequestId:', leaveRequestId)
      return NextResponse.json(
        { error: 'Missing or invalid leave request ID', id: leaveRequestId },
        { status: 400 }
      )
    }

    const supabaseUrl = getSupabaseUrl()
    const headers = getSupabaseHeaders()

    // 2️⃣ Extract Bearer token for authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing token' },
        { status: 401 }
      )
    }
    const authToken = authHeader.substring(7)
    headers.Authorization = `Bearer ${authToken}`

    // 3️⃣ Get current user info from Supabase
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

    // 4️⃣ Prepare payload for approval update
    const updateData = {
      status: 'approved',
      approved_by: managerId,
      manager_reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // 5️⃣ Perform PATCH request to Supabase REST API
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
        body: JSON.stringify(updateData),
      }
    )

    if (!updateRes.ok) {
      const errText = await updateRes.text()
      console.error('❌ Supabase update error:', errText)
      return NextResponse.json(
        { error: 'Failed to approve request', details: errText },
        { status: 500 }
      )
    }

    const data = await updateRes.json()
    console.log('✅ Leave request approved:', data)

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
