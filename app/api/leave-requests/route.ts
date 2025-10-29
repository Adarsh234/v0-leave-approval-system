import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"  // use server client
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { leaveTypeId, startDate, endDate, reason } = await request.json()

    const { data, error } = await supabase
      .from("leave_requests")
      .insert([
        {
          employee_id: user.id,
          leave_type_id: leaveTypeId,
          start_date: startDate,
          end_date: endDate,
          reason,
          status: "pending",
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
