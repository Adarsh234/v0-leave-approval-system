"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RequestLeavePage() {
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  })
  const [leaveTypes, setLeaveTypes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const { data } = await supabase.from("leave_types").select("*")
        setLeaveTypes(data || [])
      } catch (err) {
        console.error("Error fetching leave types:", err)
      }
    }

    fetchLeaveTypes()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/leave-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leaveTypeId: formData.leaveType,
          startDate: formData.startDate,
          endDate: formData.endDate,
          reason: formData.reason,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to submit request")
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard/my-requests")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Failed to submit request")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Request Leave</h1>
        <p className="text-slate-400">Submit a new leave request to your manager</p>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Leave Request Form</CardTitle>
        </CardHeader>
        <CardContent>
          {success && (
            <div className="mb-4 p-4 bg-green-900 border border-green-700 rounded text-green-200">
              Leave request submitted successfully! Redirecting...
            </div>
          )}

          {error && <div className="mb-4 p-4 bg-red-900 border border-red-700 rounded text-red-200">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="leaveType" className="text-slate-200">
                Leave Type
              </Label>
              <select
                id="leaveType"
                value={formData.leaveType}
                onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                required
                className="bg-slate-700 border border-slate-600 text-white rounded px-3 py-2"
              >
                <option value="">Select leave type</option>
                {leaveTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name} ({type.days_per_year} days/year)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate" className="text-slate-200">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate" className="text-slate-200">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reason" className="text-slate-200">
                Reason
              </Label>
              <textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                required
                rows={4}
                className="bg-slate-700 border border-slate-600 text-white rounded px-3 py-2"
                placeholder="Provide a reason for your leave request"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
