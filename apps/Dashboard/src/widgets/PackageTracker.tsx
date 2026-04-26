import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import EmptyState from '../components/EmptyState'

export default function PackageTracker() {
  const { profile } = useAuth()
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('active') // active, expiring, exhausted

  const orgId = profile?.org_id

  useEffect(() => {
    if (!orgId) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const { data, error: err } = await supabase
          .from('client_packages')
          .select('*, client:clients!client_id(name, email)')
          .eq('org_id', orgId)
          .order('created_at', { ascending: false })

        if (err) throw err
        if (!cancelled) setPackages(data || [])
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

  if (packages.length === 0) {
    return <EmptyState icon="inbox" title="No packages" message="Create packages from the Admin app's service catalog" />
  }

  const now = new Date()
  const fourteenDays = new Date()
  fourteenDays.setDate(fourteenDays.getDate() + 14)

  const active = packages.filter(p => p.status === 'active')
  const expiring = active.filter(p => p.expires_at && new Date(p.expires_at) <= fourteenDays)
  const lowSessions = active.filter(p => {
    const remaining = p.total_sessions - p.used_sessions
    return remaining <= 2 && remaining > 0
  })
  const exhausted = packages.filter(p => p.status === 'exhausted' || p.status === 'expired')

  // Combined attention list: expiring OR low sessions (deduplicated)
  const attentionIds = new Set([...expiring.map(p => p.id), ...lowSessions.map(p => p.id)])
  const attention = active.filter(p => attentionIds.has(p.id))

  const filters = [
    { id: 'active', label: 'Active', count: active.length },
    { id: 'attention', label: 'Attention', count: attention.length },
    { id: 'expiring', label: 'Expiring', count: expiring.length },
    { id: 'low', label: 'Low', count: lowSessions.length },
  ]

  let displayList = []
  if (filter === 'active') displayList = active
  else if (filter === 'attention') displayList = attention
  else if (filter === 'expiring') displayList = expiring
  else if (filter === 'low') displayList = lowSessions

  return (
    <div className="space-y-3">
      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-800/60 rounded-lg p-0.5">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${
              filter === f.id
                ? 'bg-gray-700 text-white font-medium'
                : 'text-gray-500 hover:text-gray-400'
            }`}
          >
            {f.label}
            {f.count > 0 && <span className={`ml-1 ${
              f.id === 'expiring' && f.count > 0 ? 'text-brand' :
              f.id === 'low' && f.count > 0 ? 'text-red-400' :
              'text-gray-600'
            }`}>({f.count})</span>}
          </button>
        ))}
      </div>

      {/* Package list */}
      {displayList.length === 0 ? (
        <div className="text-xs text-gray-600 text-center py-4">
          No packages in this category
        </div>
      ) : (
        <div className="space-y-1.5 max-h-60 overflow-y-auto">
          {displayList.map(pkg => {
            const remaining = pkg.total_sessions - pkg.used_sessions
            const pct = pkg.total_sessions > 0 ? Math.round((pkg.used_sessions / pkg.total_sessions) * 100) : 0
            const isExpiring = pkg.expires_at && new Date(pkg.expires_at) <= fourteenDays
            const isLow = remaining <= 2 && remaining > 0

            return (
              <div key={pkg.id} className="bg-gray-800/60 rounded-lg px-3 py-2.5">
                <div className="flex items-center justify-between mb-1">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-white truncate">{pkg.client?.name || 'Client'}</div>
                    <div className="text-xs text-gray-500">{pkg.name}</div>
                  </div>
                  <div className="text-right ml-2 flex-shrink-0">
                    <div className={`text-sm font-medium ${
                      remaining === 0 ? 'text-red-400' :
                      isLow ? 'text-brand' :
                      'text-emerald-400'
                    }`}>
                      {remaining}/{pkg.total_sessions}
                    </div>
                    <div className="text-xs text-gray-600">remaining</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      pct >= 90 ? 'bg-red-500' :
                      pct >= 70 ? 'bg-brand' :
                      'bg-emerald-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Expiry warning */}
                {isExpiring && pkg.expires_at && (
                  <div className="text-xs text-brand mt-1">
                    Expires {new Date(pkg.expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
