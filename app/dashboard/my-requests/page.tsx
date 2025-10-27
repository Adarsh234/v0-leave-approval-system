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
          .select(`*, leave_types(name)`)
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
        return "bg-gradient-to-r from-green-700 to-green-900 text-green-200"
      case "rejected":
        return "bg-gradient-to-r from-red-700 to-red-900 text-red-200"
      case "pending":
        return "bg-gradient-to-r from-yellow-700 to-yellow-900 text-yellow-200"
      case "cancelled":
        return "bg-gradient-to-r from-slate-600 to-slate-800 text-slate-200"
      default:
        return "bg-gradient-to-r from-slate-700 to-slate-800 text-slate-200"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-white text-lg font-medium animate-pulse">
          Fetching your leave requests...
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-white bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          My Leave Requests
        </h1>
        <p className="text-slate-400 mt-2">
          Review your submitted leave applications and their current status
        </p>
      </div>

      {/* No Requests */}
      {requests.length === 0 ? (
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-lg">
          <CardContent className="pt-8 pb-8 text-center">
            <p className="text-slate-400 text-base">You haven’t made any leave requests yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-5">
          {requests.map((request) => (
            <Card
              key={request.id}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-md 
              hover:shadow-blue-900/40 hover:scale-[1.01] transition-all duration-300 rounded-xl"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white text-lg font-semibold">
                      {request.leave_types.name}
                    </CardTitle>
                    <p className="text-slate-400 text-sm mt-1">
                      {new Date(request.start_date).toLocaleDateString()} →{" "}
                      {new Date(request.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold shadow-inner ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Reason:</p>
                  <p className="text-slate-200 bg-slate-800/70 border border-slate-700 p-3 rounded-lg text-sm">
                    {request.reason}
                  </p>
                </div>

                <div className="text-xs text-slate-500 italic">
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
