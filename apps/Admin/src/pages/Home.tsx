import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

function PulseCard({ label, value, subtext, icon, alert = false }) {
  return (
    <div className={`relative overflow-hidden bg-gray-900/80 border ${alert ? 'border-red-500/50' : 'border-gray-800'} rounded-2xl p-6 backdrop-blur-sm group hover:bg-gray-800/80 transition-all`}>
      {alert && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 blur-2xl rounded-full" />
      )}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-400">{label}</p>
          <p className={`text-3xl font-bold tracking-tight ${alert ? 'text-red-400' : 'text-white'}`}>{value}</p>
          {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-xl ${alert ? 'bg-red-500/10 text-red-400' : 'bg-brand/10 text-brand'}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const { profile } = useAuth()
  const [stats, setStats] = useState({ users: 0, clients: 0, appointments: 0, services: 0 })
  const [recentActivity, setRecentActivity] = useState([])
  const [pulse, setPulse] = useState({
    todayRevenue: 0,
    utilization: 0,
    atRiskRevenue: 0,
    todayAppts: 0
  })
  const [analytics, setAnalytics] = useState({
    revenue30: 0,
    newClients30: 0,
    cancellationRate30: 0,
    dailyBreakdown: [],
    cancellationInsights: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile?.org_id) return
    fetchStats()
  }, [profile?.org_id])

  async function fetchStats() {
    setLoading(true)
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString()
      const sevenDaysAgo  = new Date(Date.now() -  7 * 86400000).toISOString()
      const todayStart = new Date(); todayStart.setHours(0,0,0,0);
      const todayEnd = new Date(); todayEnd.setHours(23,59,59,999);

      const [users, clients, appointments, services, activity, recentClients, recentAppts, weekAppts, todayApptsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('org_id', profile.org_id),
        supabase.from('clients').select('id', { count: 'exact', head: true }).eq('org_id', profile.org_id),
        supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('org_id', profile.org_id),
        supabase.from('services').select('id', { count: 'exact', head: true }).eq('org_id', profile.org_id),
        supabase.from('activity_log').select('id, action, created_at, profiles(full_name)')
          .eq('org_id', profile.org_id).order('created_at', { ascending: false }).limit(5),
        supabase.from('clients').select('id', { count: 'exact', head: true })
          .eq('org_id', profile.org_id).gte('created_at', thirtyDaysAgo),
        supabase.from('appointments').select('id, status, price, created_at, cancellationReason')
          .eq('org_id', profile.org_id).gte('created_at', thirtyDaysAgo),
        supabase.from('appointments').select('id, price, start_time')
          .eq('org_id', profile.org_id).gte('start_time', sevenDaysAgo),
        supabase.from('appointments').select('id, price, status, is_paid')
          .eq('org_id', profile.org_id).gte('start_time', todayStart.toISOString()).lte('start_time', todayEnd.toISOString())
      ])

      setStats({
        users: users.count ?? 0,
        clients: clients.count ?? 0,
        appointments: appointments.count ?? 0,
        services: services.count ?? 0,
      })
      setRecentActivity(activity.data || [])

      // Analytics logic
      const appts30 = recentAppts.data || []
      const revenue30 = appts30.filter(a => a.status !== 'cancelled').reduce((sum, a) => sum + (Number(a.price) || 0), 0)
      const cancelled30 = appts30.filter(a => a.status === 'cancelled').length
      const cancellationRate30 = appts30.length > 0 ? Math.round((cancelled30 / appts30.length) * 100) : 0

      // Calculate Cancellation Insights
      const cancelReasons = {}
      appts30.filter(a => a.status === 'cancelled').forEach(a => {
        const reason = a.cancellationReason || 'Unknown / Not Provided'
        cancelReasons[reason] = (cancelReasons[reason] || 0) + 1
      })
      const cancellationInsights = Object.entries(cancelReasons)
        .map(([reason, count]) => ({ reason, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 4) // Top 4 reasons

      const dayMap = {}
      for (let i = 6; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000)
        const key = d.toISOString().slice(0, 10)
        dayMap[key] = { date: key, count: 0, revenue: 0 }
      }
      ;(weekAppts.data || []).forEach(a => {
        if (!a.start_time) return
        const key = a.start_time.slice(0, 10)
        if (dayMap[key]) {
          dayMap[key].count += 1
          dayMap[key].revenue += Number(a.price) || 0
        }
      })

      // Pulse Logic (Today)
      const tAppts = todayApptsRes.data || [];
      const todayRev = tAppts.reduce((sum, a) => sum + (Number(a.price) || 0), 0);
      // Simulate At-Risk as appointments today that are not paid/confirmed
      const atRisk = tAppts.filter(a => !a.is_paid && a.status !== 'completed').reduce((sum, a) => sum + (Number(a.price) || 0), 0);
      // Mock Utilization (assume 8 appointments is 100% for simple demo)
      const util = Math.min(Math.round((tAppts.length / 10) * 100), 100);

      setPulse({
        todayRevenue: todayRev,
        utilization: util,
        atRiskRevenue: atRisk,
        todayAppts: tAppts.length
      })

      setAnalytics({
        revenue30,
        newClients30: recentClients.count ?? 0,
        cancellationRate30,
        dailyBreakdown: Object.values(dayMap),
        cancellationInsights,
      })
    } catch {
      // Keep defaults
    } finally {
      setLoading(false)
    }
  }

  function formatCurrency(n) {
    return `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  }

  function formatDay(isoDate) {
    const d = new Date(isoDate + 'T00:00:00')
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Here is what's happening at your business today.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Today's Pulse */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">Today's Pulse</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <PulseCard 
                label="Expected Revenue" 
                value={formatCurrency(pulse.todayRevenue)} 
                subtext={`Across ${pulse.todayAppts} appointments`}
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />
              <PulseCard 
                label="Staff Utilization" 
                value={`${pulse.utilization}%`} 
                subtext="Booked capacity for today"
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />
              <PulseCard 
                label="At-Risk Revenue" 
                value={formatCurrency(pulse.atRiskRevenue)} 
                alert={pulse.atRiskRevenue > 0}
                subtext="Unconfirmed or no card on file"
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
              />
              <PulseCard 
                label="Cancellation Rate (30d)" 
                value={`${analytics.cancellationRate30}%`} 
                subtext={`${pulse.todayAppts} total appointments`}
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Last 30 days summary */}
            <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col">
              <div className="px-6 py-5 border-b border-gray-800 flex justify-between items-center">
                <h2 className="text-base font-semibold text-white">Performance (Last 30 Days)</h2>
                <span className="text-xs text-brand bg-brand/10 px-2 py-1 rounded-full font-medium">Growth</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-800 flex-1">
                <div className="px-6 py-8 flex flex-col justify-center">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Revenue</p>
                  <p className="text-4xl font-bold text-white mt-2 tabular-nums">{formatCurrency(analytics.revenue30)}</p>
                </div>
                <div className="px-6 py-8 flex flex-col justify-center">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">New Clients</p>
                  <p className="text-4xl font-bold text-white mt-2 tabular-nums">+{analytics.newClients30}</p>
                </div>
              </div>
            </div>

            {/* Recent activity */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col h-[300px]">
              <div className="px-6 py-5 border-b border-gray-800">
                <h2 className="text-base font-semibold text-white">Recent Activity</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {recentActivity.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-center">
                    <p className="text-sm text-gray-500">No recent activity</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {recentActivity.map(a => (
                      <div key={a.id} className="px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-colors flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-brand" />
                          <p className="text-sm text-gray-300">
                            <span className="font-medium text-white">{a.profiles?.full_name || 'System'}</span>
                            {' '}
                            <span className="text-gray-400">{a.action.replace(/\./g, ' ')}</span>
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {new Date(a.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Cancellation Insights */}
            <div className="lg:col-span-3 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col">
              <div className="px-6 py-5 border-b border-gray-800 flex justify-between items-center">
                <h2 className="text-base font-semibold text-white">Cancellation Insights (30 Days)</h2>
                <span className="text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded-full font-medium">{analytics.cancellationRate30}% Rate</span>
              </div>
              <div className="p-6">
                {analytics.cancellationInsights.length === 0 ? (
                  <div className="flex h-32 items-center justify-center text-center">
                    <p className="text-sm text-gray-500">No cancellations recorded in the last 30 days.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {analytics.cancellationInsights.map((item, i) => (
                      <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex flex-col">
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider line-clamp-1">{item.reason}</span>
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-white">{item.count}</span>
                          <span className="text-sm text-gray-500">lost appts</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
