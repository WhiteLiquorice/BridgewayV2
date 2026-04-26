import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Analytics() {
  const { profile } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  async function loadData() {
    if (!profile?.org_id) return
    setLoading(true)
    try {
      const { data: tx } = await supabase
        .from('pos_transactions')
        .select('*')
        .eq('org_id', profile.org_id)
        .order('created_at', { ascending: false })

      const { data: appts } = await supabase
        .from('appointments')
        .select('*')
        .eq('org_id', profile.org_id)

      setTransactions(tx || [])
      setAppointments(appts || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [profile?.org_id])

  const stats = useMemo(() => {
    const totalRevenue = transactions.reduce((sum, t) => sum + (t.total_cents || 0), 0) / 100
    const cancelled = appointments.filter(a => a.status === 'cancelled')
    const totalAppts = appointments.length
    const churnRate = totalAppts > 0 ? (cancelled.length / totalAppts) * 100 : 0

    // Group cancellation reasons
    const reasons = {}
    cancelled.forEach(a => {
      const r = a.cancellation_reason || 'Other'
      reasons[r] = (reasons[r] || 0) + 1
    })

    return {
      totalRevenue,
      cancelledCount: cancelled.length,
      churnRate,
      reasons: Object.entries(reasons).sort((a, b) => (b[1] as number) - (a[1] as number))
    }
  }, [transactions, appointments])

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-white">Analytics & Insights</h1>
        <p className="text-sm text-gray-500 mt-1">Understand your business performance and client retention.</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Total Revenue</p>
          <p className="text-2xl font-bold text-white">${stats.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Total Visits</p>
          <p className="text-2xl font-bold text-white">{appointments.length}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Cancellations</p>
          <p className="text-2xl font-bold text-red-400">{stats.cancelledCount}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Cancellation Rate</p>
          <p className="text-2xl font-bold text-amber-400">{stats.churnRate.toFixed(1)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Cancellation Reasons */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-white mb-6">Cancellation Insights</h2>
          {stats.reasons.length === 0 ? (
            <p className="text-sm text-gray-600 italic">No cancellation data available.</p>
          ) : (
            <div className="space-y-4">
              {stats.reasons.map(([reason, count]) => {
                const pct = (count as number / stats.cancelledCount) * 100
                return (
                  <div key={reason}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-300 font-medium">{reason}</span>
                      <span className="text-gray-500">{count} visits ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-brand h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Growth Trends (placeholder for chart) */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-white font-medium text-sm">Revenue Growth</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-[200px]">Historical revenue trending and forecast data will appear here as you process more transactions.</p>
        </div>
      </div>
    </div>
  )
}
