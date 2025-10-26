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

        console.log("[v0] Session found, token:", session.access_token.substring(0, 20) + "...")

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
    return <div className="text-white">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome, {stats?.name}</h1>
        <p className="text-slate-400">Manage your leave requests and approvals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-200">Leave Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">
              {stats?.leaveBalance?.reduce(
                (sum: number, record: any) => sum + (record.total_days - record.used_days),
                0,
              ) || 0}
            </div>
            <p className="text-slate-400 text-sm mt-2">Days available</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-200">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">{stats?.pendingRequests?.length || 0}</div>
            <p className="text-slate-400 text-sm mt-2">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-200">Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400 capitalize">{stats?.role}</div>
            <p className="text-slate-400 text-sm mt-2">Your access level</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
