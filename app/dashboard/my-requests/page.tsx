"use client"

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
          .from("leave_requests")
          .select(`
            *,
            leave_types(name)
          `)
          .eq("user_id", user.id)
          .order("requested_at", { ascending: false })

        setRequests(data || [])
      } catch (error) {
        console.error("Error fetching requests:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMyRequests()
  }, [supabase])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-900 text-green-200"
      case "rejected":
        return "bg-red-900 text-red-200"
      case "pending":
        return "bg-yellow-900 text-yellow-200"
      case "cancelled":
        return "bg-slate-700 text-slate-200"
      default:
        return "bg-slate-700 text-slate-200"
    }
  }

  if (loading) {
    return <div className="text-white">Loading...</div>
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">My Leave Requests</h1>
        <p className="text-slate-400">View the status of all your leave requests</p>
      </div>

      {requests.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <p className="text-slate-400 text-center">No leave requests yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white">{request.leave_types.name}</CardTitle>
                    <p className="text-slate-400 text-sm">
                      {request.start_date} to {request.end_date}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded text-sm ${getStatusColor(request.status)}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-slate-400 text-sm">Reason</p>
                  <p className="text-white">{request.reason}</p>
                </div>

                <div className="text-xs text-slate-500">
                  Requested on {new Date(request.requested_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
