import { NextResponse } from 'next/server'
import { getSupabaseHeaders, getSupabaseUrl } from '@/lib/supabase/server'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const leaveRequestId = params.id

    // ✅ Manual auth: extract Bearer token
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing token' },
        { status: 401 }
      )
    }
    const token = authHeader.replace('Bearer ', '')

    // ✅ Optional comment (from manager)
    let comment: string | null = null
    try {
      const body = await req.json()
      comment = body?.comment || null
    } catch {
      // no body — ignore
    }

    // ✅ Prepare the update payload
    const updateData = {
      status: 'rejected',
      manager_comment: comment || 'Rejected by manager',
      manager_reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // ✅ Send PATCH request to Supabase REST API
    const response = await fetch(
      `${getSupabaseUrl()}/rest/v1/leave_requests?id=eq.${leaveRequestId}`,
      {
        method: 'PATCH',
        headers: getSupabaseHeaders(token),
        body: JSON.stringify(updateData),
      }
    )

    if (!response.ok) {
      const err = await response.text()
      console.error('[reject] Supabase error:', err)
      return NextResponse.json(
        { error: 'Failed to reject request', details: err },
        { status: 500 }
      )
    }

    const data = await response.json()
    return NextResponse.json({ message: 'Leave request rejected', data })
  } catch (err) {
    console.error('[reject] Internal error:', err)
    return NextResponse.json(
      { error: 'Internal server error', details: String(err) },
      { status: 500 }
    )
  }
}
