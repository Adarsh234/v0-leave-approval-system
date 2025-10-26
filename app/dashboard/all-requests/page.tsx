"use client"

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"

export default function AllRequestsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("all")
  const supabase = createClient()

  useEffect(() => {
    const fetchAllRequests = async () => {
      try {
        let query = supabase
          .from("leave_requests")
          .select(`
            *,
            users:user_id(full_name, email, department_id),
            leave_types(name)
          `)
          .order("requested_at", { ascending: false })

        if (filterStatus !== "all") {
          query = query.eq("status", filterStatus)
        }

        const { data } = await query
        setRequests(data || [])
      } catch (error) {
        console.error("Error fetching requests:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllRequests()
  }, [filterStatus, supabase])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-900 text-green-200"
      case "rejected":
        return "bg-red-900 text-red-200"
      case "pending":
        return "bg-yellow-900 text-yellow-200"
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
        <h1 className="text-3xl font-bold text-white mb-2">All Leave Requests</h1>
        <p className="text-slate-400">View and manage all leave requests across the organization</p>
      </div>

      <div className="mb-6 flex gap-2">
        {["all", "pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded capitalize ${
              filterStatus === status ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {requests.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <p className="text-slate-400 text-center">No requests found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white">{request.users.full_name}</CardTitle>
                    <p className="text-slate-400 text-sm">{request.users.email}</p>
                  </div>
                  <span className={`px-3 py-1 rounded text-sm ${getStatusColor(request.status)}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm">Leave Type</p>
                    <p className="text-white font-medium">{request.leave_types.name}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Start Date</p>
                    <p className="text-white font-medium">{request.start_date}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">End Date</p>
                    <p className="text-white font-medium">{request.end_date}</p>
                  </div>
                </div>

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
