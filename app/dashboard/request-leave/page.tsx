'use client'

import type React from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RequestLeavePage() {
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
  })
  const [leaveTypes, setLeaveTypes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  // Fetch leave types
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const { data } = await supabase.from('leave_types').select('*')
        setLeaveTypes(data || [])
      } catch (err) {
        console.error('Error fetching leave types:', err)
      }
    }
    fetchLeaveTypes()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Get current session
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session)
        throw new Error('You must be signed in to submit a leave request')

      const response = await fetch('/api/leave-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`, // ✅ pass token
        },
        credentials: 'include', // ✅ important
        body: JSON.stringify({
          leave_type_id: formData.leaveType,
          start_date: formData.startDate,
          end_date: formData.endDate,
          reason: formData.reason,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit request')
      }

      setSuccess(true)
      setTimeout(() => router.push('/dashboard/my-requests'), 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to submit request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* Page Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
          Request Leave
        </h1>
        <p className="text-slate-400 text-sm">
          Fill out the form below to submit a new leave request
        </p>
      </div>

      {/* Leave Request Form */}
      <Card className="bg-slate-800/70 border border-slate-700 shadow-2xl backdrop-blur-lg transition-all duration-300 hover:shadow-blue-900/20">
        <CardHeader>
          <CardTitle className="text-xl text-white font-semibold flex items-center gap-2">
            📝 Leave Request Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          {success && (
            <div className="mb-4 p-4 bg-green-900/70 border border-green-700 rounded-lg text-green-200 text-sm animate-pulse">
              ✅ Leave request submitted successfully! Redirecting...
            </div>
          )}
          {error && (
            <div className="mb-4 p-4 bg-red-900/70 border border-red-700 rounded-lg text-red-200 text-sm">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Leave Type */}
            <div className="grid gap-2">
              <Label htmlFor="leaveType" className="text-slate-200 font-medium">
                Leave Type
              </Label>
              <select
                id="leaveType"
                value={formData.leaveType}
                onChange={(e) =>
                  setFormData({ ...formData, leaveType: e.target.value })
                }
                required
                className="bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
              >
                <option value="">Select leave type</option>
                {leaveTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name} ({type.days_per_year} days/year)
                  </option>
                ))}
              </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label
                  htmlFor="startDate"
                  className="text-slate-200 font-medium"
                >
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  required
                  className="bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate" className="text-slate-200 font-medium">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  required
                  className="bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                />
              </div>
            </div>

            {/* Reason */}
            <div className="grid gap-2">
              <Label htmlFor="reason" className="text-slate-200 font-medium">
                Reason
              </Label>
              <textarea
                id="reason"
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                required
                rows={4}
                className="bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                placeholder="Provide a reason for your leave request..."
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className={`w-full text-white font-semibold py-2 rounded-lg transition-all duration-200 ${
                loading
                  ? 'bg-blue-800 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-blue-900/30'
              }`}
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
