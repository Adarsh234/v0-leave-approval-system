import { createServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Create Supabase client with request cookies
    const supabase = createServerClient(req);

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = user.id;
    const { leaveTypeId, startDate, endDate, reason } = await req.json();

    // Get manager ID
    const { data: userDetails } = await supabase
      .from("users")
      .select("manager_id")
      .eq("id", userId)
      .single();

    if (!userDetails) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Insert leave request
    const { data, error } = await supabase
      .from("leave_requests")
      .insert({
        user_id: userId,
        leave_type_id: leaveTypeId,
        start_date: startDate,
        end_date: endDate,
        reason,
        manager_id: userDetails.manager_id,
        status: "pending",
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
