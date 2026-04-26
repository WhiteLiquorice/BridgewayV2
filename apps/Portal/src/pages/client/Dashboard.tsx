import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useTerminology } from '../../context/TerminologyContext'
import { supabase } from '../../lib/supabase'

function QuickLink({ to, label, description, icon }) {
  return (
    <Link
      to={to}
      className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none p-7 hover:shadow-[0_12px_40px_rgb(0,0,0,0.07)] dark:hover:bg-neutral-800 transition-all group"
    >
      <div className="w-9 h-9 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center mb-4 group-hover:border-neutral-200 transition-colors">
        {icon}
      </div>
      <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{label}</p>
      <p className="text-xs text-neutral-400 mt-1">{description}</p>
    </Link>
  )
}

export default function ClientDashboard() {
  const { profile, org } = useAuth()
  const { primaryColor } = useTheme()
  const { terms } = useTerminology()

  const [nextAppt, setNextAppt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [checkedIn, setCheckedIn] = useState(false)
  const [checkingIn, setCheckingIn] = useState(false)
  const [checkInMsg, setCheckInMsg] = useState('')

  const [nowMs, setNowMs] = useState(Date.now())
  useEffect(() => {
    const iv = setInterval(() => setNowMs(Date.now()), 60000)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    if (!profile?.org_id) return
    async function fetchData() {
      setLoading(true)
      try {
        const now = new Date().toISOString()
        const [nextRes] = await Promise.all([
          supabase.from('appointments')
            .select('*, service:services!service_id(name)')
            .eq('status', 'confirmed')
            .gt('scheduled_at', now)
            .order('scheduled_at', { ascending: true })
            .limit(1),
        ])
        setNextAppt(nextRes.data?.[0] || null)
      } catch { /* leave stale */ } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [profile?.org_id])

  const apptTime  = nextAppt ? new Date(nextAppt.scheduled_at).getTime() : null
  const isToday   = apptTime ? new Date(apptTime).toDateString() === new Date(nowMs).toDateString() : false
  const minsTill  = apptTime ? (apptTime - nowMs) / 60000 : Infinity
  const showCheckin =
    (org?.patient_checkin_enabled ?? true) && isToday && minsTill >= 0 && minsTill <= 60

  async function handleCheckIn() {
    if (checkedIn || checkingIn) return
    setCheckingIn(true)
    setCheckInMsg('')
    try {
      const { data: clientRecord, error: clientErr } = await supabase
        .from('clients')
        .select('id, name, phone')
        .eq('org_id', profile.org_id)
        .eq('email', profile.email)
        .maybeSingle()
      if (clientErr) throw clientErr
      if (!clientRecord) {
        setCheckInMsg(`Could not find your ${terms.client.singular.toLowerCase()} record. Please check in at the front desk.`)
        return
      }
      const { error: queueErr } = await supabase.from('queue_entries').insert({
        org_id:      profile.org_id,
        client_id:   clientRecord.id,
        client_name: clientRecord.name,
        status:      'waiting',
        joined_at:   new Date().toISOString(),
      })
      if (queueErr) throw queueErr
      setCheckedIn(true)
      setCheckInMsg("You've been added to the queue. We'll be with you shortly.")
    } catch (err) {
      setCheckInMsg(err.message || 'Something went wrong. Please check in at the front desk.')
    } finally {
      setCheckingIn(false)
    }
  }

  function formatDate(dt) {
    return new Date(dt).toLocaleString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    })
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'there'
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-neutral-200 border-t-neutral-600 rounded-full animate-spin" />
    </div>
  )

  return (
    <div>

      {/* Welcome header */}
      <div className="mb-14">
        <p className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-3">{today}</p>
        <h1 className="font-serif text-5xl tracking-tight text-neutral-900 leading-tight">
          Welcome back,<br />{firstName}
        </h1>
      </div>

      {/* Next appointment */}
      <div className="mb-12">
        <p className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-4">Your Next Visit</p>
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none p-10">
          {nextAppt ? (
            <div>
              <p className="font-serif text-2xl text-neutral-900 dark:text-white mb-1">{nextAppt.service?.name || 'Appointment'}</p>
              <p className="text-sm font-medium mt-2" style={{ color: primaryColor }}>{formatDate(nextAppt.scheduled_at)}</p>
              {nextAppt.notes && (
                <p className="text-sm text-neutral-400 mt-3 italic">{nextAppt.notes}</p>
              )}
              <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <span className="text-xs text-neutral-400 uppercase tracking-wider">Amount Due</span>
                <span className="font-serif text-xl text-neutral-900 dark:text-white">${parseFloat(nextAppt.amount || 0).toFixed(2)}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <p className="text-sm font-medium text-neutral-600">No upcoming visits</p>
              <p className="text-xs text-neutral-400 mt-1">Book an appointment to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Self check-in — only within 60 min of today's appointment */}
      {showCheckin && (
        <div className="mb-12">
          <button
            onClick={handleCheckIn}
            disabled={checkedIn || checkingIn}
            className={`w-full rounded-2xl px-8 py-5 text-left transition-all ${
              checkedIn
                ? 'bg-emerald-50 border border-emerald-100 cursor-default'
                : 'border hover:shadow-[0_12px_40px_rgb(0,0,0,0.07)] cursor-pointer'
            }`}
            style={!checkedIn ? { borderColor: `${primaryColor}30`, backgroundColor: `${primaryColor}08` } : {}}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={!checkedIn ? { backgroundColor: `${primaryColor}18` } : { backgroundColor: '#d1fae5' }}
              >
                {checkedIn ? (
                  <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" style={{ color: primaryColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <div>
                <p className={`text-sm font-semibold ${checkedIn ? 'text-emerald-700' : 'text-neutral-800'}`}>
                  {checkingIn ? 'Checking in…' : checkedIn ? "You're checked in" : "I'm Here — Check In"}
                </p>
                <p className={`text-xs mt-0.5 ${checkedIn ? 'text-emerald-500' : 'text-neutral-400'}`}>
                  {checkedIn ? "The team will be with you shortly" : "Let us know you've arrived"}
                </p>
              </div>
            </div>
          </button>
          {checkInMsg && !checkedIn && (
            <p className="mt-2 text-sm text-red-500 px-1">{checkInMsg}</p>
          )}
        </div>
      )}

      {/* Book CTA */}
      <div className="mb-12">
        <Link
          to="/portal/book"
          className="flex items-center justify-between w-full rounded-2xl px-8 py-6 text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: primaryColor }}
        >
          <div>
            <p className="font-serif text-xl tracking-tight">Book an Appointment</p>
            <p className="text-white/70 text-xs mt-0.5 font-sans tracking-wide">Request your preferred date and time</p>
          </div>
          <svg className="w-5 h-5 text-white/70 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Quick links */}
      <div>
        <p className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-4">Quick Access</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <QuickLink
            to="/portal/appointments"
            label="My Appointments"
            description="View and manage your schedule"
            icon={
              <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            }
          />
          <QuickLink
            to="/portal/documents"
            label="My Documents"
            description="Access files shared with you"
            icon={
              <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            }
          />
          <QuickLink
            to="/portal/profile"
            label="My Profile"
            description="Update your contact info"
            icon={
              <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  )
}
