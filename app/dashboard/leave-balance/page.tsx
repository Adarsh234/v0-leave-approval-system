'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// ✅ Manual Supabase connection
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co'
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

interface LeaveRecord {
  id: number
  user_id: string
  leave_type_id: number
  total_days: number
}

interface LeaveRequest {
  id: number
  user_id: string
  leave_type_id: number
  start_date: string
  end_date: string
  status: string
}

export default function LeaveBalancePage() {
  const [records, setRecords] = useState<
    (LeaveRecord & { used_days: number })[]
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaveBalance = async () => {
      try {
        // Fetch all leave records
        const { data: leaveRecords, error: recordError } = await supabase
          .from('leave_records')
          .select('*')

        if (recordError) throw recordError

        // Fetch approved leave requests
        const { data: leaveRequests, error: requestError } = await supabase
          .from('leave_requests')
          .select('*')
          .eq('status', 'approved')

        if (requestError) throw requestError

        // Calculate used days dynamically
        const recordsWithUsed = (leaveRecords || []).map((record) => {
          const usedDays = (leaveRequests || [])
            .filter(
              (req) =>
                req.leave_type_id === record.leave_type_id &&
                req.user_id === record.user_id
            )
            .reduce((sum, req) => {
              const start = new Date(req.start_date)
              const end = new Date(req.end_date)
              const diff =
                (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1
              return sum + diff
            }, 0)

          return {
            ...record,
            used_days: usedDays,
          }
        })

        setRecords(recordsWithUsed)
      } catch (error) {
        console.error('Error fetching leave balance:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaveBalance()
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Leave Balance</h1>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Leave Type ID</th>
            <th className="p-2 border">Total Days</th>
            <th className="p-2 border">Used Days</th>
            <th className="p-2 border">Remaining Days</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id} className="text-center">
              <td className="p-2 border">{record.leave_type_id}</td>
              <td className="p-2 border">{record.total_days}</td>
              <td className="p-2 border">{record.used_days}</td>
              <td className="p-2 border">
                {record.total_days - record.used_days}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
