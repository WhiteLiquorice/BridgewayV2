import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { logActivity } from '../lib/logActivity'
import { STATUS_LABELS, getStatusStyle, getNextStatus, NEXT_ACTION_LABELS, NEXT_ACTION_STYLES } from '../lib/appointmentStatus'

export default function TodaySchedule() {
  const { profile } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    if (!profile?.org_id) return
    fetchToday()
  }, [profile?.org_id])

  useEffect(() => {
    if (!profile?.org_id) return
    const channel = supabase
      .channel('today-schedule-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'appointments',
      }, () => {
        fetchToday()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [profile?.org_id])

  async function fetchToday() {
    setLoading(true)
    setError(false)
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString()
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59).toISOString()

    try {
      const { data } = await supabase
        .from('appointments')
        .select('id, scheduled_at, status, amount, duration_minutes, clients(name), services(name, duration_minutes)')
        .eq('org_id', profile.org_id)
        .gte('scheduled_at', startOfDay)
        .lte('scheduled_at', endOfDay)
        .neq('status', 'cancelled')
        .order('scheduled_at')

      setAppointments(data || [])
    } catch {
      setError(true)
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }

  async function advanceStatus(id, currentStatus) {
    const next = getNextStatus(currentStatus)
    if (!next) return
    setUpdating(id)
    try {
      await supabase.from('appointments').update({ status: next }).eq('id', id)
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: next } : a))
      logActivity({ org_id: profile.org_id, user_id: profile.user_id, action: `appointment.status.${next}`, entity_type: 'appointment', entity_id: id })
    } catch { /* silent */ }
    finally { setUpdating(null) }
  }

  async function cancelAppointment(id) {
    setUpdating(id)
    try {
      await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', id)
      setAppointments(prev => prev.filter(a => a.id !== id))
      logActivity({ org_id: profile.org_id, user_id: profile.user_id, action: 'appointment.cancelled', entity_type: 'appointment', entity_id: id })
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

  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mb-3">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm">No appointments today</p>
      </div>
    )
  }

  return (
    <div className="space-y-2 pr-1">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-gray-500">{appointments.length} appointment{appointments.length !== 1 ? 's' : ''} today</span>
      </div>
      {appointments.map(appt => {
        const time = new Date(appt.scheduled_at).toLocaleTimeString('en-US', {
          hour: 'numeric', minute: '2-digit', hour12: true,
        })
        const duration = appt.services?.duration_minutes || appt.duration_minutes
        const nextStatus = getNextStatus(appt.status)
        const isUpdating = updating === appt.id

        return (
          <div
            key={appt.id}
            className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{appt.clients?.name ?? '—'}</p>
              <p className="text-xs text-gray-500 truncate">
                {appt.services?.name ?? '—'}
                {duration ? ` · ${duration} min` : ''}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <p className="text-xs font-medium text-gray-300 tabular-nums">{time}</p>
              <div className="flex items-center gap-1">
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${getStatusStyle(appt.status)}`}>
                  {STATUS_LABELS[appt.status] || appt.status}
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
                {appt.status !== 'completed' && (
                  <button
                    onClick={() => cancelAppointment(appt.id)}
                    disabled={isUpdating}
                    className="text-[10px] px-1.5 py-0.5 rounded border border-red-500/20 text-red-400/70 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                    title="Cancel"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
