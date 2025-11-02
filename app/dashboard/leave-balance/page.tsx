'use client'

import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState, useEffect } from 'react'

export default function LeaveBalancePage() {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchLeaveBalance = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
          .from('leave_records')
          .select(`*, leave_types(name, description)`)
          .eq('user_id', user.id)
          .order('academic_year', { ascending: false })

        setRecords(data || [])
      } catch (error) {
        console.error('Error fetching leave balance:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaveBalance()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-white animate-pulse">Loading leave balances...</p>
      </div>
    )
  }

  // Group records by academic year
  const recordsByYear = records.reduce((acc: any, record) => {
    if (!acc[record.academic_year]) acc[record.academic_year] = []
    acc[record.academic_year].push(record)
    return acc
  }, {})

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-white bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Leave Balance
        </h1>
        <p className="text-slate-400 mt-2">
          Check your leave balance by type and working year
        </p>
      </div>

      {Object.keys(recordsByYear).length === 0 ? (
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-lg">
          <CardContent className="pt-8 pb-8 text-center">
            <p className="text-slate-400 text-base">No leave records found.</p>
          </CardContent>
        </Card>
      ) : (
        Object.keys(recordsByYear).map((year) => (
          <div key={year} className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4 border-b border-slate-700 pb-2">
              Working Year: {year}
            </h2>
            <div className="space-y-5">
              {recordsByYear[year].map((record: any) => {
                const usedPercentage = Math.min(
                  (record.used_days / record.total_days) * 100,
                  100
                )

                return (
                  <Card
                    key={record.id}
                    className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-md 
                    hover:shadow-blue-900/40 hover:scale-[1.01] transition-all duration-300 rounded-xl"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white text-lg font-semibold">
                            {record.leave_types.name}
                          </CardTitle>
                          <p className="text-slate-400 text-sm">
                            {record.leave_types.description}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-gradient-to-r from-blue-700 to-blue-900 text-blue-200 rounded-full text-sm font-semibold shadow-inner">
                          {record.academic_year}
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-slate-400 text-sm">Total Days</p>
                          <p className="text-white font-bold text-2xl">
                            {record.total_days}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Used Days</p>
                          <p className="text-yellow-400 font-bold text-2xl">
                            {record.used_days}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Available</p>
                          <p className="text-green-400 font-bold text-2xl">
                            {record.total_days - record.used_days}
                          </p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-slate-700 rounded-full h-3">
                        <div
                          className="h-3 rounded-full bg-gradient-to-r from-green-500 to-blue-600 transition-all duration-500"
                          style={{ width: `${usedPercentage}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
