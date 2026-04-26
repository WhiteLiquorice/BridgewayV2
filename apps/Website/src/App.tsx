import { useState, useEffect, useCallback } from 'react'
import { supabase } from './lib/supabase'
import { functions } from './lib/firebase'
import { httpsCallable } from 'firebase/functions'

// ─── Shared Demo State Helpers ──────────────────────────────────────────────

function useWaitingTimers(initialTimes) {
  const [times, setTimes] = useState(initialTimes)
  useEffect(() => {
    const iv = setInterval(() => {
      setTimes(prev => prev.map(t => t + 1))
    }, 60000)
    return () => clearInterval(iv)
  }, [])
  return times
}

// ─── Toast Component ────────────────────────────────────────────────────────

function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4000)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div className="fixed top-16 right-6 z-50 animate-slide-in">
      <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-lg px-5 py-3 shadow-lg max-w-sm">
        <p className="text-sm text-emerald-400">{message}</p>
      </div>
    </div>
  )
}

// ─── Icons ──────────────────────────────────────────────────────────────────

function FloorIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  )
}
function PatientIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}
function RocketIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  )
}
function InfoIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
  )
}

// ─── Sidebar ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'floor',      label: 'The Floor',     icon: FloorIcon },
  { id: 'patient',    label: 'Patient View',   icon: PatientIcon },
  { id: 'getstarted', label: 'Get Started',    icon: RocketIcon },
  { id: 'howitworks', label: 'How It Works',   icon: InfoIcon },
]

function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="w-64 flex-shrink-0 flex flex-col bg-[#080f1d] border-r border-gray-800/60 min-h-0 sticky top-10">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-800/60">
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-white font-semibold text-sm truncate">Bridgeway</p>
          <p className="text-gray-500 text-xs">Demo</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActivePage(id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left ${
              activePage === id
                ? 'bg-amber-500/10 text-amber-400'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon />
            {label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-gray-800/60">
        <p className="text-[10px] text-gray-600">&copy; {new Date().getFullYear()} Bridgeway Apps</p>
      </div>
    </aside>
  )
}

// ─── Mobile Nav ─────────────────────────────────────────────────────────────

function MobileNav({ activePage, setActivePage }) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080f1d] border-t border-gray-800/60 flex">
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setActivePage(id)}
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors ${
            activePage === id ? 'text-amber-400' : 'text-gray-500'
          }`}
        >
          <Icon />
          {label}
        </button>
      ))}
    </nav>
  )
}

// ─── Demo Banner ────────────────────────────────────────────────────────────

function DemoBanner({ onGetStarted }) {
  return (
    <div className="bg-[#060d19] border-b border-gray-800/60 px-4 py-2 flex items-center justify-between z-50 relative">
      <p className="text-xs text-gray-400">
        <span className="text-amber-400 font-medium">Live Demo</span>
        <span className="hidden sm:inline"> — You're exploring a interactive preview. Ready to try the real app?</span>
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const adminUrl = isLocal
              ? 'http://localhost:5177/?demo=true'
              : 'https://bridgeway-db29e-admin.web.app/?demo=true';
            window.location.href = adminUrl;
          }}
          className="text-xs font-semibold text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/10 px-3 py-1 rounded transition-colors"
        >
          Try Live Admin App
        </button>
        <button
          onClick={() => {
            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const dashUrl = isLocal
              ? 'http://localhost:5173/?demo=true'
              : 'https://bridgeway-db29e-dashboard.web.app/?demo=true';
            window.location.href = dashUrl;
          }}
          className="text-xs font-semibold text-amber-400 border border-amber-500/30 hover:bg-amber-500/10 px-3 py-1 rounded transition-colors"
        >
          Try Live Dashboard
        </button>
        <button
          onClick={onGetStarted}
          className="text-xs font-semibold text-[#0c1a2e] bg-amber-500 hover:bg-amber-400 px-3 py-1 rounded transition-colors flex-shrink-0"
        >
          Get Started
        </button>
      </div>
    </div>
  )
}

// ─── Page 1: The Floor ──────────────────────────────────────────────────────

const DEMO_APPOINTMENTS = [
  { time: '9:00 AM',  name: 'James Wilson',      service: 'Chiropractic Adjustment',  status: 'confirmed' },
  { time: '9:30 AM',  name: 'Lisa Park',          service: 'Deep Tissue Massage',      status: 'confirmed' },
  { time: '10:00 AM', name: 'David Martinez',     service: 'Initial Exam',             status: 'confirmed' },
  { time: '10:30 AM', name: 'Angela Thompson',    service: 'Wellness Consultation',    status: 'completed' },
]

function FloorPage({ checkedIn, queueHighlight }) {
  const waitingTimes = useWaitingTimers([8, 3])
  const [confirmedIds, setConfirmedIds] = useState([])

  const statusStyle = (s) => {
    if (s === 'confirmed')    return 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
    if (s === 'completed')    return 'bg-green-500/10 text-green-400 border border-green-500/20'
    if (s === 'with_provider') return 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
    return 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
  }

  const queueEntries = [
    { name: 'James Wilson', status: 'waiting', waitIdx: 0 },
    { name: 'Lisa Park',    status: 'waiting', waitIdx: 1 },
  ]

  const queueStatusLabel = (s) => {
    if (s === 'waiting') return 'Waiting'
    if (s === 'with_provider') return 'With Provider'
    if (s === 'done') return 'Done'
    return s
  }

  const queueStatusStyle = (s) => {
    if (s === 'waiting')       return 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
    if (s === 'with_provider') return 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
    if (s === 'done')          return 'bg-green-500/10 text-green-400 border border-green-500/20'
    return 'bg-gray-500/10 text-gray-400'
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Demo dashboard */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-1">The Floor</h2>
          <p className="text-sm text-gray-500 mb-5">Your staff's command center for the entire practice, updated in real time.</p>

          <div className="space-y-6">
            {/* Summary stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'In Session', value: '1', accent: 'purple' },
                { label: 'Waiting', value: checkedIn ? '3' : '2', accent: 'amber' },
                { label: 'Confirmed Today', value: '4', accent: 'blue' },
                { label: 'Upcoming', value: '2', accent: 'green' },
              ].map(({ label, value, accent }) => {
                const colors = {
                  purple: 'bg-purple-500/10 text-purple-400',
                  amber:  'bg-amber-500/10 text-amber-400',
                  blue:   'bg-blue-500/10 text-blue-400',
                  green:  'bg-green-500/10 text-green-400',
                }
                return (
                  <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors[accent]}`}>
                        <span className="text-sm font-bold">{value}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Today's Schedule */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-800/60">
                <h3 className="text-sm font-semibold text-white">Today's Schedule</h3>
              </div>
              <div className="divide-y divide-gray-800/60">
                {DEMO_APPOINTMENTS.map((a, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-500 font-mono w-16 tabular-nums">{a.time}</span>
                      <div>
                        <p className="text-sm text-white font-medium">{a.name}</p>
                        <p className="text-xs text-gray-500">{a.service}</p>
                      </div>
                    </div>
                    <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium capitalize ${statusStyle(a.status)}`}>
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Waiting Room Queue */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-800/60">
                <h3 className="text-sm font-semibold text-white">Waiting Room Queue</h3>
              </div>
              <div className="divide-y divide-gray-800/60">
                {checkedIn && (
                  <div className={`flex items-center justify-between px-5 py-3 transition-colors ${queueHighlight ? 'bg-amber-500/5' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <span className="text-amber-400 text-[10px] font-bold">J</span>
                      </div>
                      <p className="text-sm text-white font-medium">James Wilson</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 tabular-nums">Just arrived</span>
                      <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${queueStatusStyle('waiting')}`}>
                        Checked In
                      </span>
                    </div>
                  </div>
                )}
                {queueEntries.map((q, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center">
                        <span className="text-gray-400 text-[10px] font-bold">{q.name.charAt(0)}</span>
                      </div>
                      <p className="text-sm text-white font-medium">{q.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {q.status === 'waiting' && (
                        <span className="text-xs text-gray-500 tabular-nums">{waitingTimes[q.waitIdx]} min</span>
                      )}
                      {q.status === 'with_provider' && (
                        <span className="text-xs text-gray-500 tabular-nums">{waitingTimes[q.waitIdx]} min</span>
                      )}
                      <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${queueStatusStyle(q.status)}`}>
                        {queueStatusLabel(q.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-600 text-center pt-2">
              This is live demo data. Your real dashboard will show your actual practice.
            </p>
          </div>
        </div>

        {/* Right: Feature callouts */}
        <div className="flex flex-col justify-start space-y-6 lg:pl-4">
          <div>
            <h3 className="text-white font-semibold text-sm mb-2">Everything at a glance</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Today's schedule, waiting room, and unconfirmed appointments all on one screen. No toggling between views.
            </p>
          </div>
          <div className="border-t border-gray-800/40 pt-6">
            <h3 className="text-white font-semibold text-sm mb-2">Real-time waiting room</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              When a client checks in from their phone, they appear here instantly with how long they've been waiting.
            </p>
          </div>
          <div className="border-t border-gray-800/40 pt-6">
            <h3 className="text-white font-semibold text-sm mb-2">Confirm with one click</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Unconfirmed appointments surface automatically so nothing falls through the cracks.
            </p>
          </div>
          <div className="border-t border-gray-800/40 pt-6">
            <h3 className="text-white font-semibold text-sm mb-2">Built for the front desk</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your staff sees exactly what they need and nothing they don't.
            </p>
          </div>

          {!checkedIn && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg px-4 py-3">
              <p className="text-xs text-amber-400/80">
                <span className="font-semibold">Try it:</span> Go to the Patient View section above, tap 'I'm Here' on the phone, and watch the waiting room update in real time.
              </p>
            </div>
          )}

          {/* Unconfirmed Appointments */}
          <div className="mt-4 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-800/60">
              <h3 className="text-sm font-semibold text-white">Unconfirmed Appointments</h3>
            </div>
            <div className="divide-y divide-gray-800/60">
              {[
                { name: 'Kevin Nguyen', time: 'Today at 11:00 AM', id: 'kevin' },
                { name: 'Sandra Turner', time: 'Today at 2:00 PM', id: 'sandra' },
              ].map((u) => (
                <div key={u.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm text-white font-medium">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.time}</p>
                  </div>
                  {confirmedIds.includes(u.id) ? (
                    <span className="text-[11px] px-2.5 py-1 rounded-full font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                      Confirmed
                    </span>
                  ) : (
                    <button
                      onClick={() => setConfirmedIds(prev => [...prev, u.id])}
                      className="text-xs font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Mark Confirmed
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page 2: Patient View ───────────────────────────────────────────────────

function PatientViewPage({ checkedIn, onCheckIn }) {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Phone mockup */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-1">What Your Patient Sees</h2>
          <p className="text-sm text-gray-500 mb-5">On their phone, your practice looks like this.</p>

          <div className="mx-auto max-w-[320px]">
            {/* Phone frame */}
            <div className="rounded-[2rem] border-4 border-gray-700 bg-[#0c1a2e] overflow-hidden shadow-2xl shadow-black/40">
              {/* Notch */}
              <div className="flex justify-center pt-2 pb-1">
                <div className="w-20 h-5 bg-black rounded-full" />
              </div>

              {/* Screen content */}
              <div className="px-5 pb-6 space-y-4 hide-scrollbar max-h-[520px] overflow-y-auto">
                {/* Greeting */}
                <div className="pt-2">
                  <p className="text-white font-semibold text-base">Good morning, James</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                {/* Next appointment card */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">Your next appointment</p>
                  <p className="text-sm font-semibold text-white">Chiropractic Adjustment</p>
                  <p className="text-xs text-amber-400 mt-1">Today at 9:00 AM</p>
                  <p className="text-xs text-gray-500 mt-0.5">Dr. Marcus Webb</p>
                </div>

                {/* I'm Here button */}
                <button
                  onClick={onCheckIn}
                  disabled={checkedIn}
                  className={`w-full rounded-xl px-4 py-3.5 text-left transition-all ${
                    checkedIn
                      ? 'bg-emerald-500/10 border border-emerald-500/20 cursor-default'
                      : 'bg-amber-500 hover:bg-amber-400 cursor-pointer active:scale-[0.98]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      checkedIn ? 'bg-emerald-500/20' : 'bg-white/20'
                    }`}>
                      {checkedIn ? (
                        <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-[#0c1a2e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${checkedIn ? 'text-emerald-400' : 'text-[#0c1a2e]'}`}>
                        {checkedIn ? "\u2713 You're checked in" : "I'm Here \u2192"}
                      </p>
                      <p className={`text-[11px] ${checkedIn ? 'text-emerald-400/60' : 'text-[#0c1a2e]/70'}`}>
                        {checkedIn ? 'The front desk will call you shortly' : "Let the front desk know you've arrived"}
                      </p>
                    </div>
                  </div>
                </button>

                {/* Documents */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-gray-800/60">
                    <p className="text-xs font-medium text-gray-500">My Documents</p>
                  </div>
                  {[
                    { name: 'Intake Form', date: 'Uploaded Jan 15' },
                    { name: 'Insurance Authorization', date: 'Uploaded Feb 3' },
                  ].map((d, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800/40 last:border-0">
                      <div>
                        <p className="text-xs text-white">{d.name}</p>
                        <p className="text-[10px] text-gray-600">{d.date}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          // Show a brief inline feedback
                          const btn = e.currentTarget
                          btn.textContent = 'In live account'
                          btn.disabled = true
                          setTimeout(() => { btn.textContent = 'Download'; btn.disabled = false }, 2000)
                        }}
                        className="text-[10px] text-amber-400 hover:text-amber-300 font-medium"
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Home indicator */}
              <div className="flex justify-center py-2">
                <div className="w-28 h-1 bg-gray-600 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Explanation */}
        <div className="flex flex-col justify-center space-y-8 lg:pl-4">
          <div>
            <h3 className="text-white font-semibold text-sm mb-2">Self check-in from their phone</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your clients check in from their phone before they arrive. No front desk interaction needed until they walk in the door.
            </p>
          </div>
          <div className="border-t border-gray-800/40 pt-8">
            <h3 className="text-white font-semibold text-sm mb-2">Documents in one place</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Documents you upload in your dashboard appear here instantly. Intake forms, insurance authorizations, post-visit summaries — all in one place your client can always find.
            </p>
          </div>
          <div className="border-t border-gray-800/40 pt-8">
            <h3 className="text-white font-semibold text-sm mb-2">Your brand, your portal</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              The portal inherits your practice's logo and colors. To your clients, it looks like your software.
            </p>
          </div>
          {!checkedIn && (
            <div className="border-t border-gray-800/40 pt-8">
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg px-4 py-3">
                <p className="text-xs text-amber-400/80">
                  <span className="font-semibold">Try it:</span> Tap "I'm Here" on the phone to see the check-in flow update the waiting room on The Floor page in real time.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Page 3: Get Started ────────────────────────────────────────────────────

function GetStartedPage() {
  const [form, setForm] = useState({ practice: '', email: '', tier: 'full' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({})

  // Stripe price IDs
  const PRICE_BOOKING = import.meta.env.PUBLIC_STRIPE_PRICE_BOOKING || 'price_1TQG6JJRMfcFhxi8uagAAgis'
  const PRICE_FULL_STACK = import.meta.env.PUBLIC_STRIPE_PRICE_FULL || 'price_1TQG85JRMfcFhxi8TK6bpIBU'

  async function handleSubmit(e, selectedPriceId) {
    e.preventDefault()
    const newErrors = {}
    if (!form.practice.trim()) newErrors.practice = true
    if (!form.email.trim()) newErrors.email = true
    if (Object.keys(newErrors).length) { setErrors(newErrors); return }

    setSubmitting(true)
    setError(null)
    try {
      const createCheckout = httpsCallable(functions, 'createCheckoutSession')
      const { data } = await createCheckout({
        email: form.email.trim(),
        orgName: form.practice.trim(),
        priceId: selectedPriceId
      })
      
      if (data?.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  const inputClass = (field) =>
    `w-full bg-gray-800 border ${errors[field] ? 'border-red-500/50' : 'border-gray-700'} rounded-lg px-3.5 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50`

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* Tier 1: Booking Only */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col hover:border-amber-500/30 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Booking Only</h2>
            <span className="text-[10px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Most Focused</span>
          </div>
          <p className="text-sm text-gray-400 mb-6">Perfect for businesses that just need the best booking engine on the market.</p>
          
          <div className="flex items-baseline gap-1 mb-8">
            <span className="text-4xl font-bold text-white">$105</span>
            <span className="text-sm text-gray-500">/ month</span>
          </div>

          <div className="space-y-3 mb-8 flex-1 text-sm">
            {[
              'Public booking page & widget',
              'Self check-in portal',
              'SMS & Email reminders',
              'Unlimited appointments',
              'Connect external calendars',
            ].map(f => (
              <div key={f} className="flex items-center gap-2.5 text-gray-300">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M5 13l4 4L19 7" /></svg>
                {f}
              </div>
            ))}
          </div>

          <button onClick={() => setForm(f => ({ ...f, tier: 'booking' }))} 
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${form.tier === 'booking' ? 'bg-amber-500 text-[#0c1a2e]' : 'bg-gray-800 text-gray-400 border border-gray-700 hover:text-white'}`}>
            {form.tier === 'booking' ? '✓ Selected' : 'Select Booking Only'}
          </button>
        </div>

        {/* Tier 2: Full Stack */}
        <div className="bg-gray-900 border border-amber-500/50 rounded-2xl p-8 flex flex-col shadow-2xl shadow-amber-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-amber-500 text-[#0c1a2e] text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-tighter">Recommended</div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Full Stack</h2>
          </div>
          <p className="text-sm text-gray-400 mb-6">The complete practice management suite. Run your entire business in one place.</p>
          
          <div className="flex items-baseline gap-1 mb-8">
            <span className="text-4xl font-bold text-white">$375</span>
            <span className="text-sm text-gray-500">/ month</span>
          </div>

          <div className="space-y-3 mb-8 flex-1 text-sm">
            {[
              'Everything in Booking Only',
              'Staff Command Center (The Floor)',
              'Commission tracking & Payroll',
              'Inventory & Product Sales',
              'In-depth Business Analytics',
              'Patient CRM & Intake Forms',
            ].map(f => (
              <div key={f} className="flex items-center gap-2.5 text-gray-300">
                <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M5 13l4 4L19 7" /></svg>
                {f}
              </div>
            ))}
          </div>

          <button onClick={() => setForm(f => ({ ...f, tier: 'full' }))} 
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${form.tier === 'full' ? 'bg-amber-500 text-[#0c1a2e]' : 'bg-gray-800 text-gray-400 border border-gray-700 hover:text-white'}`}>
            {form.tier === 'full' ? '✓ Selected' : 'Select Full Stack'}
          </button>
        </div>
      </div>

      {/* Signup form */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-white mb-1">Get Started</h3>
        <p className="text-xs text-gray-500 mb-5">Enter your details and you'll be taken to our secure checkout for the <span className="text-white font-semibold">{form.tier === 'full' ? 'Full Stack' : 'Booking Only'}</span> plan.</p>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <form onSubmit={(e) => handleSubmit(e, form.tier === 'full' ? PRICE_FULL_STACK : PRICE_BOOKING)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Practice Name</label>
            <input
              type="text"
              value={form.practice}
              onChange={e => { setForm(f => ({ ...f, practice: e.target.value })); setErrors(e => ({ ...e, practice: false })) }}
              className={inputClass('practice')}
              placeholder="Wellness Chiropractic"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(e => ({ ...e, email: false })) }}
              className={inputClass('email')}
              placeholder="jane@practice.com"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-[#0c1a2e] font-semibold rounded-lg px-6 py-3 text-sm transition-colors mt-2"
          >
            {submitting ? 'Redirecting to checkout...' : 'Continue to Payment \u2192'}
          </button>
        </form>
        <p className="text-[11px] text-gray-600 text-center mt-4">
          You'll be redirected to Stripe for secure payment. Cancel anytime from your admin dashboard.
        </p>
      </div>
    </div>
  )
}

// ─── Page 4: How It Works ───────────────────────────────────────────────────

function HowItWorksPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-10">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">How It Works</h2>
        <p className="text-sm text-gray-500">Common questions about Bridgeway.</p>
      </div>

      {[
        {
          heading: 'Is Bridgeway HIPAA compliant?',
          body: 'Bridgeway is strictly administrative software. We do not store medical records, treatment notes, diagnoses, or any protected health information. Appointment scheduling, client contact details, and administrative documents only — the same category of data as a paper appointment book or a Google Calendar.',
        },
        {
          heading: 'What software does Bridgeway replace?',
          body: 'Bridgeway is designed to sit alongside your existing clinical software, not replace it. If you use a clinical records system for charting or billing, keep it. Bridgeway handles your front desk operations — the parts that most clinical systems do poorly. For practices without existing software, Bridgeway can serve as your complete administrative stack.',
        },
        {
          heading: 'How does setup work?',
          body: 'When you sign up, Asher personally onboards your practice. We set up your account, import your services and staff, configure your widgets, and make sure everything looks right before you go live. Most practices are fully set up within 48 hours.',
        },
        {
          heading: 'What kinds of businesses use Bridgeway?',
          body: 'Bridgeway is built for any appointment-based business — chiropractic offices, massage therapy, yoga and fitness studios, barbershops, salons, personal training, med spas, tattoo studios, and more. If you have a front desk, a schedule, and clients, Bridgeway was built for you.',
        },
      ].map((section, i) => (
        <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-3">{section.heading}</h3>
          <p className="text-sm text-gray-400 leading-relaxed">{section.body}</p>
        </div>
      ))}

      <div className="border-t border-gray-800/60 pt-6 text-center">
        <p className="text-sm text-gray-500">
          Questions?{' '}
          <a href="mailto:contact@bridgewayapps.com" className="text-amber-400 hover:text-amber-300 transition-colors">
            contact@bridgewayapps.com
          </a>
        </p>
      </div>
    </div>
  )
}

// ─── App ────────────────────────────────────────────────────────────────────

export default function App() {
  const [activePage, setActivePage] = useState('floor')
  const [checkedIn, setCheckedIn] = useState(false)
  const [queueHighlight, setQueueHighlight] = useState(false)
  const [toast, setToast] = useState(null)

  function handleCheckIn() {
    if (checkedIn) return
    setCheckedIn(true)
    setToast('James Wilson just checked in — now visible in your waiting room')
    setQueueHighlight(true)
    // Remove highlight after 3 seconds
    setTimeout(() => setQueueHighlight(false), 3000)
  }

  const handleGetStarted = useCallback(() => {
    setActivePage('getstarted')
  }, [])

  // Page title mapping
  const PAGE_TITLES = {
    floor: 'The Floor',
    patient: 'Patient View',
    getstarted: 'Get Started',
    howitworks: 'How It Works',
  }

  return (
    <div className="min-h-screen bg-[#0c1a2e] font-sans">
      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* Demo Banner — full width, above everything */}
      <DemoBanner onGetStarted={handleGetStarted} />

      <div className="flex min-h-[calc(100vh-40px)]">
        {/* Sidebar — desktop only */}
        <div className="hidden lg:block">
          <Sidebar activePage={activePage} setActivePage={setActivePage} />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 flex flex-col overflow-auto">
          {/* Header */}
          <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-3 border-b border-gray-800/60 backdrop-blur-sm bg-[#0c1a2e]/80">
            <h1 className="text-lg font-semibold text-white">{PAGE_TITLES[activePage]}</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-700 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="hidden sm:inline text-xs">Search...</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-400">D</span>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 pb-20 lg:pb-0">
            {activePage === 'floor'      && <FloorPage checkedIn={checkedIn} queueHighlight={queueHighlight} />}
            {activePage === 'patient'    && <PatientViewPage checkedIn={checkedIn} onCheckIn={handleCheckIn} />}
            {activePage === 'getstarted' && <GetStartedPage />}
            {activePage === 'howitworks' && <HowItWorksPage />}
          </main>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav activePage={activePage} setActivePage={setActivePage} />

      {/* CSS for toast animation */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
      `}</style>
    </div>
  )
}
