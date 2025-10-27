"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = createClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          console.error("[v0] No session found")
          setLoading(false)
          return
        }

        const response = await fetch("/api/user/stats", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        })

        if (!response.ok) throw new Error("Failed to fetch stats")
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-white animate-pulse text-lg font-medium">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-white bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Welcome, {stats?.name}
        </h1>
        <p className="text-slate-400 mt-2">Manage your leave requests and approvals</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Leave Balance */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-md hover:shadow-blue-900/40 hover:scale-[1.02] transition-all duration-300 rounded-xl">
          <CardHeader>
            <CardTitle className="text-slate-200 font-semibold text-2xl items-center">Leave Balance</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="text-4xl font-bold text-blue-400">
              {stats?.leaveBalance?.reduce(
                (sum: number, record: any) => sum + (record.total_days - record.used_days),
                0
              ) || 0}
            </div>
            <p className="text-slate-400 text-sm mt-2">Days available</p>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-md hover:shadow-yellow-900/40 hover:scale-[1.02] transition-all duration-300 rounded-xl">
          <CardHeader>
            <CardTitle className="text-slate-200 font-semibold text-2xl items-center">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="text-4xl font-bold text-yellow-400">
              {stats?.pendingRequests?.length || 0}
            </div>
            <p className="text-slate-400 text-sm mt-2">Awaiting approval</p>
          </CardContent>
        </Card>

        {/* Role */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-md hover:shadow-green-900/40 hover:scale-[1.02] transition-all duration-300 rounded-xl">
          <CardHeader>
            <CardTitle className="text-slate-200 font-semibold text-2xl items-center">Role</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="text-3xl font-bold text-green-400 capitalize">{stats?.role}</div>
            <p className="text-slate-400 text-sm mt-2">Your access level</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
