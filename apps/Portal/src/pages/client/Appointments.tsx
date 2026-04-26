import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { supabase } from '../../lib/supabase'

function StatusBadge({ status }) {
  const styles = {
    confirmed: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    completed: 'bg-neutral-100 text-neutral-600 border border-neutral-200',
    cancelled: 'bg-red-50 text-red-500 border border-red-100',
    pending:   'bg-amber-50 text-amber-700 border border-amber-100',
  }
  const labels = {
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    pending:   'Pending',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
      {labels[status] || status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

const TABS = [
  { key: 'all',      label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past',     label: 'Past' },
]

export default function ClientAppointments() {
  const { profile } = useAuth()
  const { primaryColor } = useTheme()
  const clientId = profile?.id

  const [appointments, setAppointments] = useState([])
  const [cancelWindow, setCancelWindow] = useState(18)
  const [loading,   setLoading]   = useState(true)
  const [tab,       setTab]       = useState('all')
  const [cancelMsg, setCancelMsg] = useState(null)

  useEffect(() => {
    if (!clientId) return
    fetchData()
  }, [clientId])

  async function fetchData() {
    setLoading(true)
    try {
      const [apptsRes, settingsRes] = await Promise.all([
        supabase.from('appointments').select('*')
          .eq('client_id', clientId)
          .order('scheduled_at', { ascending: false }),
        supabase.from('cancellation_settings').select('pickup_window_hours').limit(1).maybeSingle(),
      ])
      setAppointments(apptsRes.data || [])
      if (settingsRes.data?.pickup_window_hours != null) {
        setCancelWindow(settingsRes.data.pickup_window_hours)
      }
    } catch { /* leave stale */ } finally {
      setLoading(false)
    }
  }

  function formatDate(dt) {
    return new Date(dt).toLocaleString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    })
  }

  function canCancel(appt) {
    if (appt.status !== 'confirmed') return false
    const hoursUntil = (new Date(appt.scheduled_at) - new Date()) / 3600000
    return hoursUntil > cancelWindow
  }

  function cancelWindowPassed(appt) {
    if (appt.status !== 'confirmed') return false
    const now = new Date()
    const apptTime = new Date(appt.scheduled_at)
    if (apptTime <= now) return false
    return (apptTime - now) / 3600000 <= cancelWindow
  }

  async function handleCancel(appt) {
    if (!window.confirm(`Cancel your ${appt.service_name} appointment?`)) return
    const { error } = await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', appt.id)
    if (error) {
      setCancelMsg({ type: 'error', text: error.message })
    } else {
      setCancelMsg({ type: 'success', text: 'Appointment cancelled.' })
      fetchData()
    }
    setTimeout(() => setCancelMsg(null), 4000)
  }

  const now = new Date()
  const filtered = appointments.filter(a => {
    if (tab === 'upcoming') return a.status === 'confirmed' && new Date(a.scheduled_at) > now
    if (tab === 'past')     return a.status !== 'confirmed' || new Date(a.scheduled_at) <= now
    return true
  })

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-neutral-200 border-t-neutral-600 rounded-full animate-spin" />
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-serif text-5xl tracking-tight text-neutral-900 dark:text-white">My Appointments</h1>
        <p className="text-sm text-neutral-400 mt-2">Your complete visit history</p>
      </div>

      {cancelMsg && (
        <div className={`mb-8 rounded-2xl px-6 py-4 ${
          cancelMsg.type === 'success'
            ? 'bg-emerald-50 border border-emerald-100 text-emerald-700'
            : 'bg-red-50 border border-red-100 text-red-600'
        }`}>
          <p className="text-sm">{cancelMsg.text}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-6 border-b border-neutral-100 mb-8">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              tab === t.key ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            {t.label}
            {tab === t.key && (
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style={{ backgroundColor: primaryColor }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Appointment cards */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none p-14 text-center">
          <p className="text-sm text-neutral-400">
            {tab === 'upcoming' ? 'No upcoming appointments.' : tab === 'past' ? 'No past appointments.' : 'No appointments yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(appt => (
            <div
              key={appt.id}
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none px-8 py-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-serif text-xl text-neutral-900 dark:text-white">{appt.service_name || 'Appointment'}</p>
                    <StatusBadge status={appt.status} />
                  </div>
                  <p className="text-sm text-neutral-500">{formatDate(appt.scheduled_at)}</p>
                  {appt.notes && (
                    <p className="text-xs text-neutral-400 mt-2 italic">{appt.notes}</p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  {appt.amount > 0 && (
                    <span className="font-serif text-xl text-neutral-700">
                      ${parseFloat(appt.amount || 0).toFixed(2)}
                    </span>
                  )}
                  {canCancel(appt) && (
                    <button
                      onClick={() => handleCancel(appt)}
                      className="text-xs text-red-400 hover:text-red-500 border border-red-100 hover:border-red-200 rounded-lg px-3 py-1.5 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  {cancelWindowPassed(appt) && (
                    <span className="text-xs text-neutral-300 italic">Cancellation window passed</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {cancelWindow > 0 && (
        <p className="text-xs text-neutral-300 mt-6">
          Appointments may be cancelled up to {cancelWindow} hours before your scheduled time.
        </p>
      )}
    </div>
  )
}
