import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useToast } from '../context/ToastContext'
import EmptyState from '../components/EmptyState'

export default function WaitlistManager() {
  const { profile } = useAuth()
  const { showToast } = useToast()
  const [waitlisted, setWaitlisted] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const orgId = profile?.org_id

  useEffect(() => {
    if (!orgId) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const { data, error: err } = await supabase
          .from('class_registrations')
          .select('*, client:clients!client_id(name, email, phone), class:classes!class_id(name, day_of_week, start_time, capacity)')
          .eq('org_id', orgId)
          .eq('status', 'waitlisted')
          .order('created_at')

        if (err) throw err
        if (!cancelled) setWaitlisted(data || [])
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [orgId])

  async function promoteToRegistered(regId) {
    try {
      const { error: err } = await supabase
        .from('class_registrations')
        .update({ status: 'registered' })
        .eq('id', regId)

      if (err) throw err
      setWaitlisted(prev => prev.filter(w => w.id !== regId))
      showToast('Client promoted from waitlist', 'success')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  async function removeFromWaitlist(regId) {
    try {
      const { error: err } = await supabase
        .from('class_registrations')
        .update({ status: 'cancelled' })
        .eq('id', regId)

      if (err) throw err
      setWaitlisted(prev => prev.filter(w => w.id !== regId))
      showToast('Removed from waitlist', 'success')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

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

  if (waitlisted.length === 0) {
    return <EmptyState icon="users" title="No waitlist" message="No clients are currently waitlisted for any class" />
  }

  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="space-y-2 max-h-72 overflow-y-auto">
      {waitlisted.map(w => (
        <div key={w.id} className="bg-gray-800/60 rounded-lg px-3 py-2.5">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <div className="text-sm text-white font-medium truncate">{w.client?.name || 'Unknown'}</div>
              <div className="text-xs text-gray-500 mt-0.5">
                {w.class?.name || 'Unknown class'} · {w.class?.day_of_week != null ? DAYS[w.class.day_of_week] : ''} {w.class?.start_time?.slice(0, 5) || ''}
              </div>
              <div className="text-xs text-gray-600 mt-0.5">
                for {w.class_date}
              </div>
            </div>
            <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
              <button
                onClick={() => promoteToRegistered(w.id)}
                className="text-xs bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 px-2 py-1 rounded transition-colors"
              >
                Promote
              </button>
              <button
                onClick={() => removeFromWaitlist(w.id)}
                className="text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 px-2 py-1 rounded transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
