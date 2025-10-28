import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;

    const body = await request.json();
    const { leaveTypeId, startDate, endDate, reason } = body;

    // Get manager_id from users table
    const { data: userDetails, error: userError } = await supabase
      .from("users")
      .select("manager_id")
      .eq("id", userId)
      .single();

    if (userError || !userDetails) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Insert leave request
    const { data, error } = await supabase.from("leave_requests").insert({
      user_id: userId,
      leave_type_id: leaveTypeId,
      start_date: startDate,
      end_date: endDate,
      reason,
      manager_id: userDetails.manager_id,
      status: "pending",
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
