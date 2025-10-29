import { NextResponse } from "next/server";
import { createServerClientInstance } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createServerClientInstance();

    // ✅ Get the logged-in user from Supabase session (via cookies)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized - no active session" },
        { status: 401 }
      );
    }

    const userId = user.id;

    // ✅ Fetch the user's profile info
    const { data: profiles, error: profileError } = await supabase
      .from("users")
      .select("role, full_name, department_id")
      .eq("id", userId);

    if (profileError) {
      console.error("[v0] Profile fetch error:", profileError.message);
      return NextResponse.json(
        { error: "Failed to fetch user profile" },
        { status: 500 }
      );
    }

    const userProfile = profiles?.[0] || {};

    // ✅ Fetch leave records
    const { data: leaveRecords, error: leaveError } = await supabase
      .from("leave_records")
      .select("*")
      .eq("user_id", userId);

    if (leaveError) {
      console.error("[v0] Leave records fetch error:", leaveError.message);
      return NextResponse.json(
        { error: "Failed to fetch leave records" },
        { status: 500 }
      );
    }

    // ✅ Fetch pending leave requests based on role
    let pendingRequests = [];

    if (userProfile.role === "manager") {
      const { data, error } = await supabase
        .from("leave_requests")
        .select("*")
        .eq("manager_id", userId)
        .eq("status", "pending");
      if (!error) pendingRequests = data || [];
    } else if (userProfile.role === "coordinator") {
      const { data, error } = await supabase
        .from("leave_requests")
        .select("*")
        .eq("status", "pending");
      if (!error) pendingRequests = data || [];
    } else {
      const { data, error } = await supabase
        .from("leave_requests")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "pending");
      if (!error) pendingRequests = data || [];
    }

    // ✅ Return combined data
    return NextResponse.json({
      role: userProfile?.role,
      name: userProfile?.full_name,
      leaveBalance: leaveRecords || [],
      pendingRequests: pendingRequests || [],
    });
  } catch (error: any) {
    console.error("[v0] Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats", details: String(error) },
      { status: 500 }
    );
  }
}
