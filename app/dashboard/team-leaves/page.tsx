"use client"

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"

export default function TeamLeavesPage() {
  const [leaves, setLeaves] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchTeamLeaves = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        const { data: employees } = await supabase
          .from("users")
          .select("id")
          .eq("manager_id", user.id)

        if (!employees || employees.length === 0) {
          setLeaves([])
          return
        }

        const employeeIds = employees.map((e) => e.id)

        const { data } = await supabase
          .from("leave_requests")
          .select(`
            *,
            users:user_id(full_name, email),
            leave_types(name)
          `)
          .in("user_id", employeeIds)
          .eq("status", "approved")
          .order("start_date", { ascending: true })

        setLeaves(data || [])
      } catch (error) {
        console.error("Error fetching team leaves:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeamLeaves()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-white animate-pulse text-lg font-medium">Loading team leaves...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
          Team Leaves
        </h1>
        <p className="text-slate-400">View approved leaves for your team members</p>
      </div>

      {leaves.length === 0 ? (
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-md rounded-xl">
          <CardContent className="pt-8 pb-8 text-center">
            <p className="text-slate-400 text-base">No approved leaves for your team</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {leaves.map((leave) => (
            <Card
              key={leave.id}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-md
              hover:shadow-green-900/50 hover:scale-[1.01] transition-all duration-300 rounded-xl"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white text-lg font-semibold">{leave.users.full_name}</CardTitle>
                    <p className="text-slate-400 text-sm">{leave.users.email}</p>
                  </div>
                  <span className="px-3 py-1 bg-gradient-to-r from-green-700 to-green-900 text-green-200 rounded-full text-sm font-semibold shadow-inner">
                    Approved
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm">Leave Type</p>
                    <p className="text-white font-medium">{leave.leave_types.name}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Start Date</p>
                    <p className="text-white font-medium">{leave.start_date}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">End Date</p>
                    <p className="text-white font-medium">{leave.end_date}</p>
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-sm">Reason</p>
                  <p className="text-white">{leave.reason}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
