// app/api/leave-requests/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseUrl, getSupabaseHeaders } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = getSupabaseUrl()
    const headers = getSupabaseHeaders()

    // 1️⃣ Extract Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const authToken = authHeader.substring(7)
    headers.Authorization = `Bearer ${authToken}`

    // 2️⃣ Get current user
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

    // 3️⃣ Parse incoming request body
    const { leave_type_id, start_date, end_date, reason } = await request.json()

    if (!leave_type_id || !start_date || !end_date || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 4️⃣ Get manager_id from user profile
    const profileRes = await fetch(
      `${supabaseUrl}/rest/v1/users?id=eq.${userId}&select=manager_id`,
      {
        headers,
      }
    )
    if (!profileRes.ok) {
      const text = await profileRes.text()
      return NextResponse.json(
        { error: 'Failed to fetch user profile', details: text },
        { status: 500 }
      )
    }
    const profiles = await profileRes.json()
    const managerId = profiles[0]?.manager_id

    // 5️⃣ Insert leave request
    const insertRes = await fetch(`${supabaseUrl}/rest/v1/leave_requests`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        manager_id: managerId || null,
        leave_type_id,
        start_date,
        end_date,
        reason,
        status: 'pending',
      }),
    })

    if (!insertRes.ok) {
      const text = await insertRes.text()
      return NextResponse.json(
        { error: 'Failed to insert leave request', details: text },
        { status: 500 }
      )
    }

    const insertedData = await insertRes.json()

    return NextResponse.json({ success: true, leaveRequest: insertedData })
  } catch (err: any) {
    console.error('Error in /api/leave-requests POST:', err)
    return NextResponse.json(
      { error: 'Internal server error', details: String(err) },
      { status: 500 }
    )
  }
}
