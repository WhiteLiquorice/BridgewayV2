import { useState, useEffect } from 'react'

// ─── Constants ────────────────────────────────────────────────────────────────

const DEMO_APPOINTMENTS = [
  { time: '9:00 AM',  name: 'James Wilson',   service: '60-min Session',       status: 'confirmed' },
  { time: '9:30 AM',  name: 'Lisa Park',       service: 'Haircut & Style',      status: 'confirmed' },
  { time: '10:00 AM', name: 'David Martinez',  service: 'Initial Consultation', status: 'confirmed' },
  { time: '10:30 AM', name: 'Angela Thompson', service: 'Group Yoga Class',     status: 'completed' },
]

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useWaitingTimers(initialTimes: number[]) {
  const [times, setTimes] = useState(initialTimes)
  useEffect(() => {
    const iv = setInterval(() => setTimes(prev => prev.map(t => t + 1)), 60000)
    return () => clearInterval(iv)
  }, [])
  return times
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4000)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div className="fixed top-4 right-6 z-[100] animate-slide-in">
      <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-lg px-5 py-3 shadow-lg max-w-sm">
        <p className="text-sm text-emerald-400">{message}</p>
      </div>
    </div>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function FloorIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  )
}

function PortalIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  )
}

function BookingIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

// ─── Marketing Nav ────────────────────────────────────────────────────────────

function MarketingNav({ onGetStarted }: { onGetStarted: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-sm border-b border-stone-100 shadow-sm'
        : 'bg-stone-50'
    }`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Wordmark */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0H5m14 0h2M5 21H3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4" />
            </svg>
          </div>
          <span className="font-serif text-neutral-900 text-base tracking-wide">Bridgeway</span>
        </div>

        {/* Links */}
        <div className="hidden sm:flex items-center gap-8">
          <a href="#features" className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors">Features</a>
          <a href="#pricing"  className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors">Pricing</a>
          <a href="#faq"      className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors">FAQ</a>
        </div>

        <button
          onClick={onGetStarted}
          className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
        >
          Get Started
        </button>
      </div>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection({ onGetStarted, onSeeLive }: { onGetStarted: () => void; onSeeLive: () => void }) {
  return (
    <section className="pt-36 pb-24 px-6 bg-stone-50">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-5">
          Practice Management Software
        </p>
        <h1 className="font-serif text-5xl lg:text-6xl text-neutral-900 tracking-tight leading-[1.1] mb-6">
          The front desk software<br className="hidden sm:block" /> your practice actually needs
        </h1>
        <p className="text-lg text-neutral-500 leading-relaxed max-w-2xl mx-auto mb-10">
          Scheduling, client portal, walk-in queue, intake forms, memberships, and in-app checkout —
          everything your front desk runs on, in one place.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onGetStarted}
            className="font-semibold text-white bg-blue-600 hover:bg-blue-700 px-7 py-3.5 rounded-xl text-sm transition-colors w-full sm:w-auto"
          >
            Get Started — $400/month
          </button>
          <button
            onClick={onSeeLive}
            className="text-sm font-medium text-neutral-500 hover:text-neutral-800 transition-colors"
          >
            See it live →
          </button>
        </div>
      </div>
    </section>
  )
}

// ─── Features Grid ────────────────────────────────────────────────────────────

function FeaturesSection() {
  const features = [
    {
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      title: 'Scheduling & Queue',
      desc: "Daily schedule, live waiting room, walk-in kiosk. Your staff's command center, updated in real time.",
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Client Portal',
      desc: 'Clients book, check in, fill out intake forms, and access documents — all from their phone.',
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      title: 'Memberships & Checkout',
      desc: 'Sell packages, process payments at the desk or at booking. Revenue tracked automatically.',
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Forms & Documents',
      desc: 'Build intake forms in minutes. Completed forms and uploaded documents live in each client profile.',
    },
  ]

  return (
    <section id="features" className="py-16 px-6 bg-stone-100/80">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(f => (
            <div key={f.title} className="bg-white rounded-2xl border border-stone-200 p-6">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center mb-4 text-blue-600">
                {f.icon}
              </div>
              <h3 className="text-sm font-semibold text-neutral-800 mb-1.5">{f.title}</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Demo: Nav items ──────────────────────────────────────────────────────────

const DEMO_NAV = [
  { id: 'floor',   label: 'The Floor',      icon: FloorIcon },
  { id: 'portal',  label: 'Client Portal',  icon: PortalIcon },
  { id: 'booking', label: 'Booking & Forms', icon: BookingIcon },
]

// ─── Demo: Sidebar ────────────────────────────────────────────────────────────

function DemoSidebar({ activePage, setActivePage }: { activePage: string; setActivePage: (id: string) => void }) {
  return (
    <aside className="w-52 flex-shrink-0 flex flex-col h-full bg-[#080f1d] border-r border-gray-800/60">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-800/60">
        <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
          <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0H5m14 0h2M5 21H3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <p className="text-white font-semibold text-sm">Bridgeway</p>
          <p className="text-gray-500 text-[10px]">Live Demo</p>
        </div>
      </div>

      <nav className="flex-1 px-2.5 py-3 space-y-0.5">
        {DEMO_NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActivePage(id)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left ${
              activePage === id
                ? 'bg-blue-500/10 text-blue-400'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon />
            {label}
          </button>
        ))}
      </nav>

      <div className="px-4 py-3 border-t border-gray-800/60">
        <p className="text-[10px] text-gray-600">© {new Date().getFullYear()} Bridgeway Apps</p>
      </div>
    </aside>
  )
}

// ─── Demo: Mobile Tabs ────────────────────────────────────────────────────────

function DemoMobileTabs({ activePage, setActivePage }: { activePage: string; setActivePage: (id: string) => void }) {
  return (
    <div className="lg:hidden flex border-b border-gray-800/60 flex-shrink-0">
      {DEMO_NAV.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setActivePage(id)}
          className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors border-b-2 ${
            activePage === id
              ? 'text-blue-400 border-blue-400'
              : 'text-gray-500 border-transparent'
          }`}
        >
          <Icon />
          <span>{label}</span>
        </button>
      ))}
    </div>
  )
}

// ─── Demo: Banner ─────────────────────────────────────────────────────────────

function DemoBanner({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="bg-[#060d19] border-b border-gray-800/60 px-4 py-2 flex items-center justify-between flex-shrink-0">
      <p className="text-xs text-gray-400">
        <span className="text-blue-400 font-medium">Live Demo</span>
        <span className="hidden sm:inline"> — You're exploring a live demo. Ready to set up your practice?</span>
      </p>
      <button
        onClick={onGetStarted}
        className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded transition-colors flex-shrink-0"
      >
        Get Started
      </button>
    </div>
  )
}

// ─── Demo Page 1: The Floor ───────────────────────────────────────────────────

function FloorPage({ checkedIn, queueHighlight }: { checkedIn: boolean; queueHighlight: boolean }) {
  const waitingTimes = useWaitingTimers([8, 3])
  const [confirmedIds, setConfirmedIds] = useState<string[]>([])

  const statusStyle = (s: string) => {
    if (s === 'confirmed')     return 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
    if (s === 'completed')     return 'bg-green-500/10 text-green-400 border border-green-500/20'
    if (s === 'with_provider') return 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
    return 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
  }

  const queueStatusStyle = (s: string) => {
    if (s === 'waiting')       return 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
    if (s === 'with_provider') return 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
    if (s === 'done')          return 'bg-green-500/10 text-green-400 border border-green-500/20'
    return 'bg-gray-500/10 text-gray-400'
  }

  return (
    <div className="p-5 overflow-y-auto h-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Panels */}
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-semibold text-white mb-0.5">The Floor</h2>
            <p className="text-xs text-gray-500">Your staff's command center, updated in real time.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'In Session', value: '1',                      color: 'text-purple-400' },
              { label: 'Waiting',    value: checkedIn ? '3' : '2',    color: 'text-amber-400' },
              { label: 'Confirmed',  value: '4',                      color: 'text-blue-400' },
              { label: 'Upcoming',   value: '2',                      color: 'text-green-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{label}</p>
                <p className={`text-xl font-bold mt-1 tabular-nums ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Schedule */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-800/60">
              <h3 className="text-xs font-semibold text-white">Today's Schedule</h3>
            </div>
            <div className="divide-y divide-gray-800/60">
              {DEMO_APPOINTMENTS.map((a, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-gray-500 font-mono w-14 tabular-nums flex-shrink-0">{a.time}</span>
                    <div>
                      <p className="text-xs text-white font-medium">{a.name}</p>
                      <p className="text-[10px] text-gray-500">{a.service}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize flex-shrink-0 ${statusStyle(a.status)}`}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Queue */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-800/60">
              <h3 className="text-xs font-semibold text-white">Waiting Room</h3>
            </div>
            <div className="divide-y divide-gray-800/60">
              {checkedIn && (
                <div className={`flex items-center justify-between px-4 py-2.5 transition-colors ${queueHighlight ? 'bg-blue-500/5' : ''}`}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-400 text-[9px] font-bold">J</span>
                    </div>
                    <p className="text-xs text-white font-medium">James Wilson</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500">Just arrived</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${queueStatusStyle('waiting')}`}>Checked In</span>
                  </div>
                </div>
              )}
              {[
                { name: 'Lisa Park',     waitIdx: 0 },
                { name: 'Marcus Brown',  waitIdx: 1 },
              ].map((q, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-400 text-[9px] font-bold">{q.name.charAt(0)}</span>
                    </div>
                    <p className="text-xs text-white font-medium">{q.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 tabular-nums">{waitingTimes[q.waitIdx]} min</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${queueStatusStyle('waiting')}`}>Waiting</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Callouts + Unconfirmed */}
        <div className="space-y-5 lg:pl-2">
          {[
            { h: 'Everything at a glance',   p: "Today's schedule, waiting room, and unconfirmed appointments — all on one screen. No toggling between views." },
            { h: 'Real-time waiting room',   p: "When a client checks in from their phone, they appear here instantly with how long they've been waiting." },
            { h: 'Confirm with one click',   p: 'Unconfirmed appointments surface automatically so nothing falls through the cracks.' },
            { h: 'Built for the front desk', p: "Your staff sees exactly what they need and nothing they don't." },
          ].map((c, i) => (
            <div key={i} className={i > 0 ? 'border-t border-gray-800/40 pt-5' : ''}>
              <h3 className="text-white font-semibold text-xs mb-1.5">{c.h}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{c.p}</p>
            </div>
          ))}

          {!checkedIn && (
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg px-4 py-3">
              <p className="text-xs text-blue-400/80">
                <span className="font-semibold">Try it:</span> Go to Client Portal, tap 'I'm Here', and watch the waiting room update in real time.
              </p>
            </div>
          )}

          {/* Unconfirmed */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-800/60">
              <h3 className="text-xs font-semibold text-white">Unconfirmed Appointments</h3>
            </div>
            <div className="divide-y divide-gray-800/60">
              {[
                { name: 'Kevin Nguyen',  time: 'Today at 11:00 AM', id: 'kevin' },
                { name: 'Sandra Turner', time: 'Today at 2:00 PM',  id: 'sandra' },
              ].map((u) => (
                <div key={u.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-xs text-white font-medium">{u.name}</p>
                    <p className="text-[10px] text-gray-500">{u.time}</p>
                  </div>
                  {confirmedIds.includes(u.id) ? (
                    <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                      Confirmed
                    </span>
                  ) : (
                    <button
                      onClick={() => setConfirmedIds(prev => [...prev, u.id])}
                      className="text-[10px] font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      Mark Confirmed
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-gray-600 text-center">
            This is live demo data. Your real dashboard will show your actual practice.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Demo Page 2: Client Portal ───────────────────────────────────────────────

function ClientPortalPage({ checkedIn, onCheckIn }: { checkedIn: boolean; onCheckIn: () => void }) {
  return (
    <div className="p-5 overflow-y-auto h-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Phone mockup */}
        <div>
          <h2 className="text-base font-semibold text-white mb-0.5">What Your Client Sees</h2>
          <p className="text-xs text-gray-500 mb-4">On their phone, your practice looks like this.</p>

          <div className="mx-auto max-w-[272px]">
            <div className="rounded-[2rem] border-4 border-gray-700 overflow-hidden shadow-2xl shadow-black/40">
              {/* Notch */}
              <div className="flex justify-center pt-2 pb-1 bg-stone-50">
                <div className="w-16 h-4 bg-neutral-900 rounded-full" />
              </div>

              {/* Light portal screen */}
              <div className="bg-stone-50 px-4 pb-5 space-y-3 hide-scrollbar max-h-[440px] overflow-y-auto">
                {/* Portal header */}
                <div className="bg-white border-b border-neutral-100 -mx-4 px-4 py-2.5 mb-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded bg-blue-100 flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-sm" />
                      </div>
                      <span className="text-[10px] font-medium text-neutral-700">My Practice</span>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-blue-600">J</span>
                    </div>
                  </div>
                </div>

                {/* Greeting */}
                <div>
                  <p className="text-neutral-400 text-[9px] uppercase tracking-widest">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="font-serif text-neutral-900 text-sm mt-0.5 leading-snug">
                    Welcome back,<br />Jamie
                  </p>
                </div>

                {/* Next visit */}
                <div className="bg-white rounded-xl border border-neutral-100 p-3">
                  <p className="text-[9px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">Your Next Visit</p>
                  <p className="text-xs font-semibold text-neutral-900">60-min Session</p>
                  <p className="text-[10px] font-medium mt-1 text-blue-600">Today at 9:30 AM</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Marcus Webb</p>
                </div>

                {/* Check-in button */}
                <button
                  onClick={onCheckIn}
                  disabled={checkedIn}
                  className={`w-full rounded-xl px-3 py-2.5 text-left transition-all ${
                    checkedIn
                      ? 'bg-emerald-50 border border-emerald-100 cursor-default'
                      : 'cursor-pointer active:scale-[0.98] border'
                  }`}
                  style={!checkedIn ? { backgroundColor: '#2563EB18', borderColor: '#2563EB30' } : {}}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      checkedIn ? 'bg-emerald-100' : 'bg-blue-100'
                    }`}>
                      {checkedIn ? (
                        <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className={`text-[11px] font-semibold ${checkedIn ? 'text-emerald-700' : 'text-neutral-800'}`}>
                        {checkedIn ? "✓ You're checked in" : "I'm Here — Check In"}
                      </p>
                      <p className={`text-[9px] ${checkedIn ? 'text-emerald-500' : 'text-neutral-400'}`}>
                        {checkedIn ? 'The team will be with you shortly' : "Let us know you've arrived"}
                      </p>
                    </div>
                  </div>
                </button>

                {/* Documents */}
                <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
                  <div className="px-3 py-2 border-b border-neutral-100">
                    <p className="text-[9px] font-medium text-neutral-400 uppercase tracking-wider">My Documents</p>
                  </div>
                  {[
                    { name: 'Intake Form',    date: 'Uploaded Jan 15' },
                    { name: 'Visit Summary',  date: 'Uploaded Feb 3' },
                  ].map((d, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2 border-b border-neutral-50 last:border-0">
                      <div>
                        <p className="text-[10px] text-neutral-700 font-medium">{d.name}</p>
                        <p className="text-[9px] text-neutral-400">{d.date}</p>
                      </div>
                      <span className="text-[9px] text-blue-600 font-medium">View</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center py-2 bg-stone-50">
                <div className="w-20 h-1 bg-neutral-300 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Callouts */}
        <div className="flex flex-col justify-center space-y-6 lg:pl-2">
          {[
            { h: 'Self check-in from their phone',    p: 'Clients check in from their phone before they arrive. No front desk interaction needed until they walk in.' },
            { h: 'Book directly from the portal',     p: 'Clients book their own appointments, pay at booking via Stripe, and see live availability — all from the portal.' },
            { h: 'Documents in one place',            p: 'Documents you upload and intake forms they complete all appear here, organized by client.' },
            { h: 'Your brand, your portal',           p: "The portal uses your practice's logo and accent color. To your clients, it looks like your software." },
          ].map((c, i) => (
            <div key={i} className={i > 0 ? 'border-t border-gray-800/40 pt-6' : ''}>
              <h3 className="text-white font-semibold text-xs mb-1.5">{c.h}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{c.p}</p>
            </div>
          ))}
          {!checkedIn && (
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg px-4 py-3">
              <p className="text-xs text-blue-400/80">
                <span className="font-semibold">Try it:</span> Tap "I'm Here" on the phone to see the check-in update the waiting room on The Floor.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Demo Page 3: Booking & Forms ─────────────────────────────────────────────

function BookingFormsPage() {
  const [selectedTime, setSelectedTime] = useState<string | null>('9:30 AM')
  const [agreedToPolicy, setAgreedToPolicy] = useState(false)

  const times = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '2:00 PM', '2:30 PM', '3:00 PM']

  return (
    <div className="p-5 overflow-y-auto h-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking wizard */}
        <div>
          <h2 className="text-base font-semibold text-white mb-0.5">Booking & Forms</h2>
          <p className="text-xs text-gray-500 mb-4">Clients book, pay, and fill out intake forms — all before they arrive.</p>

          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-800/60 flex items-center justify-between">
              <h3 className="text-xs font-semibold text-white">Book an Appointment</h3>
              {/* Step pills */}
              <div className="flex items-center gap-1.5">
                {['Service', 'Time', 'Payment'].map((s, i) => (
                  <div key={s} className="flex items-center gap-1.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      i === 0 ? 'bg-green-500/20 text-green-400'
                      : i === 1 ? 'bg-blue-500 text-white'
                      : 'bg-gray-800 text-gray-500'
                    }`}>
                      {i === 0 ? '✓' : i + 1}
                    </div>
                    {i < 2 && <div className={`w-3 h-px ${i === 0 ? 'bg-green-500/30' : 'bg-gray-700'}`} />}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 space-y-3">
              {/* Selected service */}
              <div className="bg-green-500/5 border border-green-500/20 rounded-lg px-3 py-2 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-green-400 font-medium">60-min Session</p>
                  <p className="text-[9px] text-gray-500">with Marcus Webb</p>
                </div>
                <span className="text-[10px] text-gray-400">$85</span>
              </div>

              {/* Time slots */}
              <div>
                <p className="text-[10px] font-medium text-gray-400 mb-2">Select a time — Thursday, Apr 17</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {times.map(t => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`text-[10px] py-1.5 rounded-lg font-medium transition-colors ${
                        selectedTime === t
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button className="w-full text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg py-2.5 transition-colors">
                Next: Payment →
              </button>
            </div>
          </div>

          {/* Callouts below booking */}
          <div className="mt-4 space-y-3">
            {[
              { h: 'Clients book and pay from the portal', p: 'No third-party booking tool needed. Booking is built directly into the client portal.' },
              { h: 'Payment at booking or at the desk',    p: 'Require Stripe payment upfront, or let staff collect payment at checkout — your choice.' },
            ].map((c, i) => (
              <div key={i} className={i > 0 ? 'border-t border-gray-800/40 pt-3' : ''}>
                <h3 className="text-white font-semibold text-xs mb-1">{c.h}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{c.p}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Intake form */}
        <div>
          <h2 className="text-base font-semibold text-white mb-0.5 invisible lg:visible">Intake Forms</h2>
          <p className="text-xs text-gray-500 mb-4 invisible lg:visible">Build custom forms in the admin panel.</p>

          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-800/60">
              <h3 className="text-xs font-semibold text-white">New Client Intake Form</h3>
              <p className="text-[10px] text-gray-500 mt-0.5">Collected before your first visit</p>
            </div>

            <div className="p-4 space-y-3">
              {/* Name */}
              <div>
                <label className="block text-[10px] font-medium text-gray-400 mb-1">Full Name</label>
                <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
                  <p className="text-xs text-white">Jamie Wilson</p>
                </div>
              </div>

              {/* DOB */}
              <div>
                <label className="block text-[10px] font-medium text-gray-400 mb-1">Date of Birth</label>
                <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
                  <p className="text-xs text-white">March 14, 1985</p>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-[10px] font-medium text-gray-400 mb-1">Reason for Visit</label>
                <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 h-12">
                  <p className="text-xs text-white">Shoulder pain for the past few months, worse with exercise.</p>
                </div>
              </div>

              {/* Checkbox */}
              <div
                className="flex items-start gap-2.5 cursor-pointer select-none"
                onClick={() => setAgreedToPolicy(p => !p)}
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border transition-colors ${
                  agreedToPolicy ? 'bg-blue-500 border-blue-500' : 'bg-gray-800 border-gray-600'
                }`}>
                  {agreedToPolicy && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  I agree to the cancellation policy and consent to treatment
                </p>
              </div>

              <button className="w-full text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg py-2.5 transition-colors">
                Submit Form →
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {[
              { h: 'Forms collected before the first visit', p: 'Build custom forms with text fields, checkboxes, dropdowns, and signature capture. Responses live in the client profile.' },
              { h: 'Build in the admin, fill in the portal', p: 'You design the form once in the admin panel. Clients fill it out from their phone at their own convenience.' },
            ].map((c, i) => (
              <div key={i} className={i > 0 ? 'border-t border-gray-800/40 pt-3' : ''}>
                <h3 className="text-white font-semibold text-xs mb-1">{c.h}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{c.p}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Pricing Section ──────────────────────────────────────────────────────────

function PricingSection() {
  const [form, setForm] = useState({ practice: '', email: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({})

  const supabaseUrl     = import.meta.env.PUBLIC_SUPABASE_URL     || 'https://placeholder.supabase.co'
  const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
  const priceId         = import.meta.env.PUBLIC_STRIPE_PRICE_ID  || 'price_placeholder_standard_400'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, boolean> = {}
    if (!form.practice.trim()) errs.practice = true
    if (!form.email.trim())    errs.email    = true
    if (Object.keys(errs).length) { setFieldErrors(errs); return }
    setSubmitting(true)
    setError(null)
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      const { data, error: fnError } = await supabase.functions.invoke('create-checkout-session', {
        body: { email: form.email.trim(), orgName: form.practice.trim(), priceId },
      })
      if (fnError) throw fnError
      if (data?.url) window.location.href = data.url
      else throw new Error('No checkout URL returned')
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  const inputCls = (field: string) =>
    `w-full bg-neutral-50 border ${fieldErrors[field] ? 'border-red-300' : 'border-stone-200'} rounded-xl text-sm text-neutral-900 placeholder-neutral-400 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-colors`

  const features = [
    'Dashboard with configurable widgets',
    'Client portal with self check-in and self-booking',
    'Intake forms — custom-built, collected before the first visit',
    'Memberships and packages — sell recurring plans directly',
    'POS checkout — collect payments at the desk with Stripe',
    'Public booking page + embeddable widget',
    'Class scheduling and waitlist management',
    'Walk-in queue with kiosk mode',
    'Admin panel with full user management',
    'Automated SMS and email reminders',
    'Unlimited clients and appointments',
    'Setup included — we onboard you personally',
  ]

  return (
    <section id="pricing" className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-serif text-4xl text-neutral-900 tracking-tight mb-3">Simple pricing</h2>
          <p className="text-neutral-500 text-sm">One price. No feature tiers. Everything included from day one.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* What's included */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-8">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-serif text-2xl text-neutral-900">Bridgeway</h3>
              <span className="text-xs text-neutral-500 bg-white border border-stone-200 px-2.5 py-1 rounded-full font-medium mt-1">
                Everything included
              </span>
            </div>

            <div className="flex items-baseline gap-1 mt-5 mb-1">
              <span className="font-serif text-5xl text-neutral-900">$400</span>
              <span className="text-sm text-neutral-500 ml-1">/ month</span>
            </div>
            <p className="text-xs text-neutral-400 mb-6">
              Up to 10 staff accounts. +$10/month per additional user.
            </p>



            <div className="space-y-2.5">
              {features.map(f => (
                <div key={f} className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-neutral-600">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sign-up form */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-8">
            <h3 className="font-serif text-2xl text-neutral-900 mb-1">Get Started</h3>
            <p className="text-sm text-neutral-500 mb-6">
              Enter your details and you'll be taken to our secure checkout.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-widest mb-2">
                  Practice Name
                </label>
                <input
                  type="text"
                  value={form.practice}
                  onChange={e => { setForm(f => ({ ...f, practice: e.target.value })); setFieldErrors(v => ({ ...v, practice: false })) }}
                  className={inputCls('practice')}
                  placeholder="Wellness Chiropractic"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-widest mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setFieldErrors(v => ({ ...v, email: false })) }}
                  className={inputCls('email')}
                  placeholder="jane@practice.com"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl px-6 py-3.5 text-sm transition-colors mt-2"
              >
                {submitting ? 'Redirecting to checkout...' : 'Continue to Payment →'}
              </button>
            </form>
            <p className="text-xs text-neutral-400 text-center mt-4">
              You'll be redirected to Stripe for secure payment. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── FAQ Section ──────────────────────────────────────────────────────────────

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  const faqs = [
    {
      q: 'Is Bridgeway HIPAA compliant?',
      a: 'Bridgeway is strictly administrative software. We do not store medical records, treatment notes, diagnoses, or any protected health information. Appointment scheduling, client contact details, and administrative documents only — the same category of data as a paper appointment book or a Google Calendar.',
    },
    {
      q: 'What software does Bridgeway replace?',
      a: 'Bridgeway is designed to sit alongside your existing clinical software, not replace it. If you use a clinical records system for charting or billing, keep it. Bridgeway handles your front desk operations — the parts that most clinical systems do poorly. For practices without existing software, Bridgeway can serve as your complete administrative stack.',
    },
    {
      q: 'Does Bridgeway handle payments?',
      a: "Yes. Clients can pay at booking through the portal, or staff can process payments at checkout using the built-in POS. Bridgeway connects to your own Stripe account — you get paid directly, with no middleman.",
    },
    {
      q: "Can I use Bridgeway if my clients aren't \"patients\"?",
      a: 'Absolutely. Bridgeway works for any appointment-based business. The terminology throughout the app — "client," "patient," "member" — is customizable to match how your business talks. Everything from dashboard labels to the portal greeting can reflect your own language.',
    },
    {
      q: 'How does setup work?',
      a: 'When you sign up, Asher personally onboards your practice. We set up your account, import your services and staff, configure your widgets, and make sure everything looks right before you go live. Most practices are fully set up within 48 hours.',
    },
    {
      q: 'What kinds of businesses use Bridgeway?',
      a: 'Bridgeway is built for any appointment-based business — chiropractic offices, massage therapy, yoga and fitness studios, barbershops, salons, personal training, med spas, tattoo studios, and more. If you have a front desk, a schedule, and clients, Bridgeway was built for you.',
    },
  ]

  return (
    <section id="faq" className="py-24 px-6 bg-stone-100/80">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-serif text-4xl text-neutral-900 tracking-tight mb-3">How It Works</h2>
          <p className="text-neutral-500 text-sm">Common questions about Bridgeway.</p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-sm font-semibold text-neutral-800 pr-4">{faq.q}</span>
                <svg
                  className={`w-4 h-4 text-blue-500 flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-neutral-500 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-sm text-neutral-500">
            Questions?{' '}
            <a href="mailto:contact@bridgewayapps.com" className="text-blue-600 hover:text-blue-700 transition-colors">
              contact@bridgewayapps.com
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function SiteFooter() {
  return (
    <footer className="bg-neutral-900 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-6 h-6 rounded bg-blue-900 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0H5m14 0h2M5 21H3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="font-serif text-white text-sm">Bridgeway</span>
            </div>
            <p className="text-xs text-neutral-500 max-w-xs">
              Practice management for appointment-based businesses.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <a href="#features" className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">Features</a>
            <a href="#pricing"  className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">Pricing</a>
            <a href="#faq"      className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">FAQ</a>
            <a href="mailto:contact@bridgewayapps.com" className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">Contact</a>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-8 pt-6">
          <p className="text-[11px] text-neutral-600">
            © {new Date().getFullYear()} Bridgeway Apps. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

// ─── Root Component ───────────────────────────────────────────────────────────

export default function Demo() {
  const [activePage, setActivePage] = useState('floor')
  const [checkedIn, setCheckedIn] = useState(false)
  const [queueHighlight, setQueueHighlight] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  function handleCheckIn() {
    if (checkedIn) return
    setCheckedIn(true)
    setToast('James Wilson just checked in — now visible in your waiting room')
    setQueueHighlight(true)
    setTimeout(() => setQueueHighlight(false), 3000)
  }

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const PAGE_TITLES: Record<string, string> = {
    floor:   'The Floor',
    portal:  'Client Portal',
    booking: 'Booking & Forms',
  }

  return (
    <div className="bg-stone-50 font-sans">
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      <MarketingNav onGetStarted={() => scrollTo('pricing')} />

      <HeroSection
        onGetStarted={() => scrollTo('pricing')}
        onSeeLive={() => scrollTo('demo')}
      />

      <FeaturesSection />

      {/* ── Interactive Demo Block ── */}
      <section id="demo" className="py-20 px-6 bg-stone-100/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl text-neutral-900 tracking-tight mb-2">See it in action</h2>
            <p className="text-sm text-neutral-500">Explore the live demo — it's the real product.</p>
          </div>

          {/* Dark app shell */}
          <div
            className="rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl shadow-black/20"
            style={{ height: '680px' }}
          >
            <div className="bg-[#0c1a2e] h-full flex flex-col">
              <DemoBanner onGetStarted={() => scrollTo('pricing')} />

              <div className="flex flex-1 min-h-0">
                {/* Sidebar — desktop */}
                <div className="hidden lg:block h-full">
                  <DemoSidebar activePage={activePage} setActivePage={setActivePage} />
                </div>

                {/* Main area */}
                <div className="flex-1 min-w-0 flex flex-col">
                  <header className="flex items-center justify-between px-5 py-3 border-b border-gray-800/60 bg-[#0c1a2e]/90 backdrop-blur-sm flex-shrink-0">
                    <h1 className="text-sm font-semibold text-white">{PAGE_TITLES[activePage]}</h1>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-gray-700 text-gray-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span className="hidden sm:inline text-[10px]">Search...</span>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                        <span className="text-[10px] font-semibold text-gray-400">D</span>
                      </div>
                    </div>
                  </header>

                  {/* Mobile tabs */}
                  <DemoMobileTabs activePage={activePage} setActivePage={setActivePage} />

                  <main className="flex-1 min-h-0">
                    {activePage === 'floor'   && <FloorPage checkedIn={checkedIn} queueHighlight={queueHighlight} />}
                    {activePage === 'portal'  && <ClientPortalPage checkedIn={checkedIn} onCheckIn={handleCheckIn} />}
                    {activePage === 'booking' && <BookingFormsPage />}
                  </main>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PricingSection />
      <FAQSection />
      <SiteFooter />
    </div>
  )
}
