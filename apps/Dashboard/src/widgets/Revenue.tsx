import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import AnimatedNumber from '../components/AnimatedNumber'

// Role-restricted: only admin and manager roles can see this widget.
// Enforced in registry.js (roles: ['admin', 'manager']) and useWidgetConfig (hidden by default for staff).

export default function Revenue() {
  const { profile } = useAuth()
  const [todayRevenue, setTodayRevenue] = useState(0)
  const [monthRevenue, setMonthRevenue] = useState(0)
  const [apptCount, setApptCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!profile?.org_id) return
    fetchRevenue()
  }, [profile?.org_id])

  async function fetchRevenue() {
    setLoading(true)
    setError(false)
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    try {
      const { data: todayAppts } = await supabase
        .from('appointments')
        .select('amount, status')
        .eq('org_id', profile.org_id)
        .gte('scheduled_at', startOfDay)
        .lte('scheduled_at', endOfDay)
        .neq('status', 'cancelled')

      const { data: monthAppts } = await supabase
        .from('appointments')
        .select('amount, status')
        .eq('org_id', profile.org_id)
        .gte('scheduled_at', startOfMonth)
        .neq('status', 'cancelled')

      const todayTotal = (todayAppts || []).reduce((sum, a) => sum + Number(a.amount || 0), 0)
      const monthTotal = (monthAppts || []).reduce((sum, a) => sum + Number(a.amount || 0), 0)

      setTodayRevenue(todayTotal)
      setMonthRevenue(monthTotal)
      setApptCount((todayAppts || []).length)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-red-400/70 text-sm text-center py-6">Unable to load — try refreshing</p>
    )
  }

  return (
    <div className="space-y-3">
      {/* Today */}
      <div className="flex items-start justify-between p-3 rounded-lg bg-gray-800/50">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Today</p>
          <p className="text-2xl font-bold text-white mt-1">
            <AnimatedNumber value={todayRevenue} prefix="$" decimals={2} />
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{apptCount} appointment{apptCount !== 1 ? 's' : ''}</p>
        </div>
        <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
          <svg className="w-4.5 h-4.5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      {/* Month to date */}
      <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-800/30">
        <span className="text-sm text-gray-400">Month to date</span>
        <AnimatedNumber value={monthRevenue} prefix="$" decimals={2} className="text-sm font-semibold text-white" />
      </div>
    </div>
  )
}
