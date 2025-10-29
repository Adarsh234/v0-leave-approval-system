import { NextRequest, NextResponse } from "next/server"
import { createServerClientInstance } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  const supabase = createServerClientInstance()

  const {
    data: { user },
    error: authError,
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
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
