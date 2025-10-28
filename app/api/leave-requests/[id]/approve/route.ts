import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const managerId = session.user.id;
    const requestId = params.id;

    // Update status to approved
    const { data, error } = await supabase
      .from("leave_requests")
      .update({
        status: "approved",
        manager_reviewed_at: new Date().toISOString(),
      })
      .eq("id", requestId)
      .eq("manager_id", managerId)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
