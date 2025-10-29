// app/api/leave-requests/[id]/reject/route.ts
import { NextResponse } from 'next/server'
import { getSupabaseHeaders, getSupabaseUrl } from '@/lib/supabase/server'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const leaveRequestId = params.id

    // ✅ Manual auth: extract token
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing token' },
        { status: 401 }
      )
    }
    const token = authHeader.replace('Bearer ', '')

    // ✅ Call Supabase REST API to update leave request
    const response = await fetch(
      `${getSupabaseUrl()}/rest/v1/leave_requests?id=eq.${leaveRequestId}`,
      {
        method: 'PATCH',
        headers: getSupabaseHeaders(token),
        body: JSON.stringify({ status: 'rejected' }),
      }
    )

    if (!response.ok) {
      const err = await response.json()
      console.error('[reject] Supabase error:', err)
      return NextResponse.json(
        { error: 'Failed to reject request' },
        { status: 500 }
      )
    }

    const data = await response.json()
    return NextResponse.json({ message: 'Leave request rejected', data })
  } catch (err) {
    console.error('[reject] Internal error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
