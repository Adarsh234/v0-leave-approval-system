import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseUrl, getSupabaseHeaders } from '@/lib/supabase/server'

async function validateUser(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const token = authHeader.replace('Bearer ', '')
  const res = await fetch(`${getSupabaseUrl()}/auth/v1/user`, {
    headers: { ...getSupabaseHeaders(), Authorization: `Bearer ${token}` },
  })

  if (!res.ok) return null
  return res.json()
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await validateUser(req)
    if (!user?.id)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const leaveRequestId = params.id

    const patchRes = await fetch(
      `${getSupabaseUrl()}/rest/v1/leave_requests?id=eq.${leaveRequestId}`,
      {
        method: 'PATCH',
        headers: {
          ...getSupabaseHeaders(),
          Authorization: `Bearer ${user.access_token}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify({ status: 'approved' }),
      }
    )

    const patchData = await patchRes.json()
    if (!patchRes.ok) {
      console.error('Supabase PATCH failed:', patchRes.status, patchData)
      return NextResponse.json(
        { error: 'Failed to approve request', details: patchData },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: patchData })
  } catch (error) {
    console.error('Error approving leave request:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
