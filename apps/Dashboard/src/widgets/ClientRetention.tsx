import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import EmptyState from '../components/EmptyState'

export default function ClientRetention() {
  const { profile } = useAuth()
  const [winBack, setWinBack] = useState([])
  const [birthdays, setBirthdays] = useState([])
  const [topClients, setTopClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('winback')

  const orgId = profile?.org_id

  useEffect(() => {
    if (!orgId) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        // Win-back: clients with no appointment in last 60 days
        const sixtyDaysAgo = new Date()
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

        const { data: allClients, error: cErr } = await supabase
          .from('clients')
          .select('id, name, email, phone, date_of_birth')
          .eq('org_id', orgId)
          .order('name')

        if (cErr) throw cErr

        // Get latest appointment per client
        const { data: recentAppts, error: aErr } = await supabase
          .from('appointments')
          .select('client_id, scheduled_at')
          .eq('org_id', orgId)
          .eq('status', 'completed')
          .order('scheduled_at', { ascending: false })

        if (aErr) throw aErr

        // Build map of latest appointment per client
        const latestMap = {}
        ;(recentAppts || []).forEach(a => {
          if (!latestMap[a.client_id]) latestMap[a.client_id] = a.scheduled_at
        })

        // Win-back: no visit in 60+ days or never visited
        const wb = (allClients || []).filter(c => {
          const last = latestMap[c.id]
          if (!last) return true // never visited
          return new Date(last) < sixtyDaysAgo
        }).map(c => ({
          ...c,
          lastVisit: latestMap[c.id] || null,
          daysSince: latestMap[c.id] ? Math.round((Date.now() - new Date(latestMap[c.id]).getTime()) / 86400000) : null,
        })).sort((a, b) => (a.daysSince || 999) - (b.daysSince || 999)).slice(0, 20)

        // Birthdays this month
        const now = new Date()
        const currentMonth = now.getMonth() + 1
        const bdays = (allClients || []).filter(c => {
          if (!c.date_of_birth) return false
          const month = parseInt(c.date_of_birth.split('-')[1])
          return month === currentMonth
        }).sort((a, b) => {
          const dayA = parseInt(a.date_of_birth.split('-')[2])
          const dayB = parseInt(b.date_of_birth.split('-')[2])
          return dayA - dayB
        })

        // Top clients by appointment count, with last visit date
        const countMap = {}
        ;(recentAppts || []).forEach(a => {
          countMap[a.client_id] = (countMap[a.client_id] || 0) + 1
        })
        const top = (allClients || [])
          .map(c => ({ ...c, visits: countMap[c.id] || 0, lastVisit: latestMap[c.id] || null }))
          .filter(c => c.visits > 0)
          .sort((a, b) => b.visits - a.visits)
          .slice(0, 10)

        if (!cancelled) {
          setWinBack(wb)
          setBirthdays(bdays)
          setTopClients(top)
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [orgId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="text-sm text-red-400 p-4">{error}</div>
  }

  const tabs = [
    { id: 'winback', label: 'Win-Back', count: winBack.length },
    { id: 'birthdays', label: 'Birthdays', count: birthdays.length },
    { id: 'top', label: 'Top Clients', count: topClients.length },
  ]

  return (
    <div className="space-y-3">
      {/* Tab bar */}
      <div className="flex gap-1 bg-gray-800/60 rounded-lg p-0.5">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${
              tab === t.id
                ? 'bg-gray-700 text-white font-medium'
                : 'text-gray-500 hover:text-gray-400'
            }`}
          >
            {t.label} {t.count > 0 && <span className="text-gray-600">({t.count})</span>}
          </button>
        ))}
      </div>

      {/* Win-back tab */}
      {tab === 'winback' && (
        winBack.length === 0 ? (
          <EmptyState icon="users" title="All caught up" message="No clients need win-back outreach" />
        ) : (
          <div className="space-y-1 max-h-52 overflow-y-auto">
            {winBack.map(c => (
              <div key={c.id} className="flex items-center justify-between bg-gray-800/60 rounded-lg px-3 py-2">
                <div className="min-w-0">
                  <div className="text-sm text-white truncate">{c.name}</div>
                  <div className="text-xs text-gray-500">
                    {c.daysSince ? `${c.daysSince} days since last visit` : 'Never visited'}
                  </div>
                </div>
                {c.phone && (
                  <span className="text-xs text-gray-600 ml-2 flex-shrink-0">{c.phone}</span>
                )}
              </div>
            ))}
          </div>
        )
      )}

      {/* Birthdays tab */}
      {tab === 'birthdays' && (
        birthdays.length === 0 ? (
          <EmptyState icon="calendar" title="No birthdays" message="No client birthdays this month" />
        ) : (
          <div className="space-y-1 max-h-52 overflow-y-auto">
            {birthdays.map(c => {
              const day = parseInt(c.date_of_birth.split('-')[2])
              const today = new Date().getDate()
              const isToday = day === today
              return (
                <div key={c.id} className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                  isToday ? 'bg-brand/10 border border-brand/20' : 'bg-gray-800/60'
                }`}>
                  <div>
                    <span className="text-sm text-white">{c.name}</span>
                    {isToday && <span className="ml-2 text-xs text-brand">🎂 Today!</span>}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(c.date_of_birth + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              )
            })}
          </div>
        )
      )}

      {/* Top clients tab */}
      {tab === 'top' && (
        topClients.length === 0 ? (
          <EmptyState icon="chart" title="No data" message="Complete some appointments to see top clients" />
        ) : (
          <div className="space-y-1 max-h-52 overflow-y-auto">
            {topClients.map((c, i) => (
              <div key={c.id} className="flex items-center gap-2 bg-gray-800/60 rounded-lg px-3 py-2">
                <span className={`text-xs font-mono w-5 text-right ${
                  i === 0 ? 'text-brand' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-brand' : 'text-gray-600'
                }`}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-white truncate">{c.name}</span>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs text-gray-400">{c.visits} visits</span>
                  {c.lastVisit && (
                    <div className="text-[10px] text-gray-600">
                      {new Date(c.lastVisit).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
