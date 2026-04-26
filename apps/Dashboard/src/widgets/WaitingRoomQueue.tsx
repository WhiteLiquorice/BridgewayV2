import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { STATUS_LABELS, getStatusStyle, getNextStatus, NEXT_ACTION_LABELS, NEXT_ACTION_STYLES } from '../lib/appointmentStatus'

export default function WaitingRoomQueue() {
  const { profile } = useAuth()
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [updating, setUpdating] = useState(null)

  const fetchQueue = useCallback(async () => {
    if (!profile?.org_id) return
    setError(false)
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString()
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59).toISOString()

    try {
      const { data } = await supabase
        .from('appointments')
        .select('id, scheduled_at, status, clients(name), services(name)')
        .eq('org_id', profile.org_id)
        .gte('scheduled_at', startOfDay)
        .lte('scheduled_at', endOfDay)
        .in('status', ['arrived', 'with_provider'])
        .order('scheduled_at')

      setQueue(data || [])
    } catch {
      setError(true)
      setQueue([])
    } finally {
      setLoading(false)
    }
  }, [profile?.org_id])

  useEffect(() => {
    if (!profile?.org_id) return
    fetchQueue()
    const interval = setInterval(fetchQueue, 30000)
    return () => clearInterval(interval)
  }, [profile?.org_id, fetchQueue])

  useEffect(() => {
    if (!profile?.org_id) return
    const channel = supabase
      .channel('waiting-room-queue-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'queue_entries',
      }, () => {
        fetchQueue()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [profile?.org_id, fetchQueue])

  async function advanceStatus(id, currentStatus) {
    const next = getNextStatus(currentStatus)
    if (!next) return
    setUpdating(id)
    try {
      await supabase.from('appointments').update({ status: next }).eq('id', id)
      if (next === 'completed') {
        setQueue(prev => prev.filter(a => a.id !== id))
      } else {
        setQueue(prev => prev.map(a => a.id === id ? { ...a, status: next } : a))
      }
    } catch { /* silent */ }
    finally { setUpdating(null) }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return <p className="text-red-400/70 text-sm text-center py-6">Unable to load — try refreshing</p>
  }

  if (queue.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mb-3">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm">No patients waiting</p>
        <p className="text-gray-600 text-xs mt-0.5">Patients appear here after check-in</p>
      </div>
    )
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-gray-500">{queue.length} patient{queue.length !== 1 ? 's' : ''} in queue</span>
      </div>
      {queue.map(appt => {
        const time = new Date(appt.scheduled_at).toLocaleTimeString('en-US', {
          hour: 'numeric', minute: '2-digit', hour12: true,
        })
        const nextStatus = getNextStatus(appt.status)
        const isUpdating = updating === appt.id

        return (
          <div
            key={appt.id}
            className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-gray-800/50"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{appt.clients?.name ?? '—'}</p>
              <p className="text-xs text-gray-500 truncate">
                {appt.services?.name ?? '—'} · {time}
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${getStatusStyle(appt.status)}`}>
                {STATUS_LABELS[appt.status]}
              </span>
              {nextStatus && (
                <button
                  onClick={() => advanceStatus(appt.id, appt.status)}
                  disabled={isUpdating}
                  className={`text-[10px] px-2 py-0.5 rounded border font-medium transition-colors disabled:opacity-50 ${NEXT_ACTION_STYLES[appt.status] || ''}`}
                >
                  {isUpdating ? '...' : NEXT_ACTION_LABELS[appt.status]}
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
