"use client"

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"

export default function LeaveRecordsPage() {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRole, setSelectedRole] = useState("all")
  const supabase = createClient()

  useEffect(() => {
    const fetchLeaveRecords = async () => {
      try {
        const { data } = await supabase
          .from("leave_records")
          .select(`
            *,
            users:user_id(full_name, email, role),
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

  const uniqueRoles = Array.from(new Set(records.map((r) => r.users.role))).sort()

  if (loading) {
    return <div className="text-white flex justify-center items-center min-h-[60vh]">Loading...</div>
  }

  // Filter by role if selected
  const filteredRecords = selectedRole === "all" ? records : records.filter((r) => r.users.role === selectedRole)

  // Group by academic year
  const groupedByYear = filteredRecords.reduce((acc: any, record) => {
    const year = record.academic_year
    if (!acc[year]) acc[year] = []
    acc[year].push(record)
    return acc
  }, {})

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
          Leave Records
        </h1>
        <p className="text-slate-400">View leave balance and usage categorized by academic year and role</p>
      </div>

      {/* Role Filter */}
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setSelectedRole("all")}
          className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
            selectedRole === "all" ? "bg-blue-600 text-white shadow-lg" : "bg-slate-700 text-slate-300 hover:bg-slate-600 hover:scale-105"
          }`}
        >
          All Roles
        </button>
        {uniqueRoles.map((role) => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
              selectedRole === role
                ? "bg-gradient-to-r from-green-500 to-green-700 text-white shadow-lg"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600 hover:scale-105"
            }`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      {Object.keys(groupedByYear).length === 0 ? (
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-md rounded-xl">
          <CardContent className="pt-8 text-center">
            <p className="text-slate-400 text-base">No leave records found</p>
          </CardContent>
        </Card>
      ) : (
        Object.keys(groupedByYear)
          .sort((a, b) => Number(b) - Number(a))
          .map((year) => (
            <div key={year}>
              <h2 className="text-xl font-semibold text-white mb-2 bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">
                Academic Year: {year}
              </h2>
              <div className="space-y-4">
                {groupedByYear[year].map((record) => (
                  <Card
                    key={record.id}
                    className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-md hover:shadow-indigo-600/50 hover:scale-[1.01] transition-all duration-300 rounded-xl"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white text-lg font-semibold">{record.users.full_name}</CardTitle>
                          <p className="text-slate-400 text-sm">{record.users.email} | Role: {record.users.role}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-900 text-blue-200">
                          {record.academic_year}
                        </span>
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
            </div>
          ))
      )}
    </div>
  )
}
