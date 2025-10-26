"use client"

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"

export default function LeaveBalancePage() {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchLeaveBalance = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
          .from("leave_records")
          .select(`
            *,
            leave_types(name, description)
          `)
          .eq("user_id", user.id)
          .order("academic_year", { ascending: false })

        setRecords(data || [])
      } catch (error) {
        console.error("Error fetching leave balance:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaveBalance()
  }, [supabase])

  if (loading) {
    return <div className="text-white">Loading...</div>
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Leave Balance</h1>
        <p className="text-slate-400">View your leave balance by type and academic year</p>
      </div>

      {records.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <p className="text-slate-400 text-center">No leave records found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <Card key={record.id} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white">{record.leave_types.name}</CardTitle>
                    <p className="text-slate-400 text-sm">{record.leave_types.description}</p>
                  </div>
                  <span className="px-3 py-1 bg-slate-700 text-slate-200 rounded text-sm">{record.academic_year}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-slate-400 text-sm">Total Days</p>
                      <p className="text-white font-bold text-2xl">{record.total_days}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Used Days</p>
                      <p className="text-yellow-400 font-bold text-2xl">{record.used_days}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Available</p>
                      <p className="text-green-400 font-bold text-2xl">{record.total_days - record.used_days}</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(record.used_days / record.total_days) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
