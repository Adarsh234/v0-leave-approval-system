import { NextRequest, NextResponse } from "next/server"
import { getSupabaseUrl, getSupabaseHeaders } from "@/lib/supabase/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabaseUrl = getSupabaseUrl()
    const headers = getSupabaseHeaders()
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Missing request ID" }, { status: 400 })
    }

    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const authToken = authHeader.replace("Bearer ", "")
    headers.Authorization = `Bearer ${authToken}`

    // Parse body
    const body = await request.json().catch(() => null)
    if (!body || !body.action) {
      return NextResponse.json({ error: "Missing action field" }, { status: 400 })
    }

    const { action } = body
    const newStatus = action === "approve" ? "approved" : "rejected"

    console.log(`[v0] Updating request ${id} to status: ${newStatus}`)

    // Update Supabase record
    const updateResponse = await fetch(`${supabaseUrl}/rest/v1/leave_requests?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    })

    if (!updateResponse.ok) {
      const errText = await updateResponse.text()
      console.error("[v0] Supabase update failed:", errText)
      return NextResponse.json({ error: "Failed to update leave request" }, { status: updateResponse.status })
    }

    console.log(`[v0] Leave request ${id} successfully updated to ${newStatus}`)
    return NextResponse.json({ message: `Leave request ${newStatus}` })
  } catch (error) {
    console.error("[v0] Error approving/rejecting request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
