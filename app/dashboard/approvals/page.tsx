"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export default function ApprovalsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          setLoading(false)
          return
        }

        const response = await fetch("/api/manager/pending-requests", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch requests")
        }

        const data = await response.json()
        setRequests(data || [])
      } catch (error) {
        console.error("Error fetching requests:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPendingRequests()
  }, [supabase])

  const handleApprove = async (requestId: string) => {
    setProcessingId(requestId)
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        throw new Error("Not authenticated")
      }

      const response = await fetch(`/api/leave-requests/${requestId}/approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to approve request")
      }

      setRequests(requests.filter((r) => r.id !== requestId))
    } catch (error) {
      console.error("Error approving request:", error)
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (requestId: string) => {
    setProcessingId(requestId)
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        throw new Error("Not authenticated")
      }

      const response = await fetch(`/api/leave-requests/${requestId}/reject`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to reject request")
      }

      setRequests(requests.filter((r) => r.id !== requestId))
    } catch (error) {
      console.error("Error rejecting request:", error)
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return <div className="text-white">Loading...</div>
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Pending Approvals</h1>
        <p className="text-slate-400">Review and approve leave requests from your team</p>
      </div>

      {requests.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <p className="text-slate-400 text-center">No pending requests</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white">{request.users?.full_name || "Unknown"}</CardTitle>
                    <p className="text-slate-400 text-sm">{request.users?.email || "N/A"}</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-900 text-yellow-200 rounded text-sm">
                    {request.leave_types?.name || "Unknown"}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => handleApprove(request.id)}
                    disabled={processingId === request.id}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {processingId === request.id ? "Processing..." : "Approve"}
                  </Button>
                  <Button
                    onClick={() => handleReject(request.id)}
                    disabled={processingId === request.id}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    {processingId === request.id ? "Processing..." : "Reject"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
