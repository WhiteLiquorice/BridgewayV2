import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useToast } from '../context/ToastContext'

export default function UnconfirmedAppointments() {
  const { profile } = useAuth()
  const { showToast } = useToast()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState(null)
  const [reminderSent, setReminderSent] = useState({})
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!profile?.org_id) return
    fetchUnconfirmed()
  }, [profile?.org_id])

  async function fetchUnconfirmed() {
    setLoading(true)
    setError(false)
    const in48h = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()

    try {
      const { data } = await supabase
        .from('appointments')
        .select('id, scheduled_at, clients(name, email, phone), services(name)')
        .eq('org_id', profile.org_id)
        .lt('scheduled_at', in48h)
        .gte('scheduled_at', new Date().toISOString())
        .eq('status', 'pending')
        .order('scheduled_at')

      setAppointments(data || [])
    } catch {
      setError(true)
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }

  async function handleConfirm(id) {
    setConfirming(id)
    try {
      await supabase.from('appointments').update({ status: 'confirmed' }).eq('id', id)
      await fetchUnconfirmed()
    } catch { /* silent */ }
    finally { setConfirming(null) }
  }

  function handleSendReminder(id, clientName) {
    setReminderSent(prev => ({ ...prev, [id]: true }))
    showToast(`Reminder sent to ${clientName}`, 'success')
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
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm">All caught up</p>
        <p className="text-gray-600 text-xs mt-0.5">No unconfirmed appointments in next 48h</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {appointments.map(appt => {
        const dt = new Date(appt.scheduled_at)
        const dateStr = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        const timeStr = dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        const isSent = reminderSent[appt.id]
        return (
          <div
            key={appt.id}
            className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-gray-800/50"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{appt.clients?.name ?? '—'}</p>
              <p className="text-xs text-gray-500 truncate">
                {appt.services?.name ?? '—'} · {dateStr} at {timeStr}
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {isSent ? (
                <span className="text-[10px] px-2 py-0.5 rounded text-green-400/70 font-medium">Sent</span>
              ) : (
                <button
                  onClick={() => handleSendReminder(appt.id, appt.clients?.name ?? 'client')}
                  className="text-xs px-2 py-1 rounded-md bg-brand/10 text-brand border border-brand/20 hover:bg-brand/20 transition-colors font-medium"
                >
                  Remind
                </button>
              )}
              <button
                onClick={() => handleConfirm(appt.id)}
                disabled={confirming === appt.id}
                className="text-xs px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors font-medium disabled:opacity-50"
              >
                {confirming === appt.id ? '...' : 'Confirm'}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
