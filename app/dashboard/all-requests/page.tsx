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
        return "bg-gradient-to-r from-green-700 to-green-900 text-green-200"
      case "rejected":
        return "bg-gradient-to-r from-red-700 to-red-900 text-red-200"
      case "pending":
        return "bg-gradient-to-r from-yellow-700 to-yellow-900 text-yellow-200"
      default:
        return "bg-slate-700 text-slate-200"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-white animate-pulse text-lg font-medium">Loading leave requests...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          All Leave Requests
        </h1>
        <p className="text-slate-400">View and manage all leave requests across the organization</p>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex flex-wrap gap-2 justify-center">
        {["all", "pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-full capitalize font-medium transition-all duration-300 ${
              filterStatus === status
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600 hover:scale-105"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {requests.length === 0 ? (
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-md rounded-xl">
          <CardContent className="pt-8 pb-8 text-center">
            <p className="text-slate-400 text-base">No requests found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card
              key={request.id}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-md
              hover:shadow-blue-900/50 hover:scale-[1.01] transition-all duration-300 rounded-xl"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white text-lg font-semibold">{request.users.full_name}</CardTitle>
                    <p className="text-slate-400 text-sm">{request.users.email}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold shadow-inner ${getStatusColor(
                      request.status
                    )}`}
                  >
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
