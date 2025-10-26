"use client"

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"

export default function LeaveRecordsPage() {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchLeaveRecords = async () => {
      try {
        const { data } = await supabase
          .from("leave_records")
          .select(`
            *,
            users:user_id(full_name, email),
            leave_types(name)
          `)
          .order("academic_year", { ascending: false })

        setRecords(data || [])
      } catch (error) {
        console.error("Error fetching records:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaveRecords()
  }, [supabase])

  if (loading) {
    return <div className="text-white">Loading...</div>
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Leave Records</h1>
        <p className="text-slate-400">View leave balance and usage by academic year</p>
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
                    <CardTitle className="text-white">{record.users.full_name}</CardTitle>
                    <p className="text-slate-400 text-sm">{record.users.email}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-900 text-blue-200 rounded text-sm">{record.academic_year}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm">Leave Type</p>
                    <p className="text-white font-medium">{record.leave_types.name}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Total Days</p>
                    <p className="text-white font-medium text-lg">{record.total_days}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Used Days</p>
                    <p className="text-yellow-400 font-medium text-lg">{record.used_days}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Remaining</p>
                    <p className="text-green-400 font-medium text-lg">{record.total_days - record.used_days}</p>
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
