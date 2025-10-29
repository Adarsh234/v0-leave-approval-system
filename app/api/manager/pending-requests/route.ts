import { NextResponse } from "next/server";
import { createServerClientInstance } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createServerClientInstance();

    // ✅ Get the logged-in user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized - no active session" }, { status: 401 });
    }

    const managerId = user.id;
    console.log("[v0] Fetching pending requests for manager:", managerId);

    // ✅ Fetch pending requests assigned to this manager
    const { data: requests, error: requestsError } = await supabase
      .from("leave_requests")
      .select("*")
      .eq("manager_id", managerId)
      .eq("status", "pending")
      .order("requested_at", { ascending: false });

    if (requestsError) {
      console.error("[v0] Failed to fetch requests:", requestsError.message);
      return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
    }

    console.log("[v0] Found pending requests:", requests?.length || 0);

    // ✅ Fetch related data for each request (user info + leave type)
    const enrichedRequests = await Promise.all(
      (requests || []).map(async (req) => {
        const { data: userData } = await supabase
          .from("users")
          .select("full_name, email")
          .eq("id", req.user_id)
          .single();

        const { data: leaveTypeData } = await supabase
          .from("leave_types")
          .select("name")
          .eq("id", req.leave_type_id)
          .single();

        return {
          ...req,
          users: userData || null,
          leave_types: leaveTypeData || null,
        };
      })
    );

    return NextResponse.json(enrichedRequests);
  } catch (error) {
    console.error("[v0] Error fetching pending requests:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
