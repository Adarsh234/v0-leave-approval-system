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

        // Get all employees managed by this manager
        const { data: employees } = await supabase.from("users").select("id").eq("manager_id", user.id)

        if (!employees || employees.length === 0) {
          setLeaves([])
          return
        }

        const employeeIds = employees.map((e) => e.id)

        // Get approved leaves for these employees
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
    return <div className="text-white">Loading...</div>
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Team Leaves</h1>
        <p className="text-slate-400">View approved leaves for your team members</p>
      </div>

      {leaves.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <p className="text-slate-400 text-center">No approved leaves for your team</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {leaves.map((leave) => (
            <Card key={leave.id} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white">{leave.users.full_name}</CardTitle>
                    <p className="text-slate-400 text-sm">{leave.users.email}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-900 text-green-200 rounded text-sm">Approved</span>
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
