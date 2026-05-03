/** Cache-buster: 2026-04-27-2000 */
import { useState, useEffect, useRef } from 'react'
import { auth } from '@bridgeway/ui';
// ═════════════════════════════════════════════════════════════════════════════
// Bridgeway marketing site — luxury shell, sidebar nav.
//
// Five sections, sidebar-switchable:
//   1. Front Desk      — dark-navy Dashboard preview (matches the real app)
//   2. Client Portal   — light-luxury phone mockup (matches the real Portal)
//   3. Design Your App — split-screen Interactive Demo (generator + mock flows)
//   4. Pricing         — Stripe checkout form
//   5. FAQ             — collapsible Q&A
//
// Cross-section interactions: when a user checks in or books on the Client
// Portal, the Front Desk view updates live. This demonstrates both sides of
// the workflow from a single prospect interaction.
// ═════════════════════════════════════════════════════════════════════════════

// ─── Icons ───────────────────────────────────────────────────────────────────

function DashboardIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  )
}
function PortalIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  )
}
function SettingsIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}
function TagIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  )
}
function HelpIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

// ─── Toast ───────────────────────────────────────────────────────────────────

type ToastItem = { id: number; message: string; tone: 'success' | 'info' }

function ToastStack({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: number) => void }) {
  return (
    <div className="fixed top-6 right-6 z-[100] space-y-2.5">
      {toasts.map(t => <ToastItemEl key={t.id} t={t} onDismiss={onDismiss} />)}
    </div>
  )
}

function ToastItemEl({ t, onDismiss }: { t: ToastItem; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const tm = setTimeout(() => onDismiss(t.id), 4500)
    return () => clearTimeout(tm)
  }, [t.id])
  const isSuccess = t.tone === 'success'
  return (
    <div
      className={`animate-slide-in bg-white rounded-2xl px-5 py-3.5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border flex items-start gap-3 max-w-sm ${
        isSuccess ? 'border-emerald-100' : 'border-neutral-100'
      }`}
    >
      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
        isSuccess ? 'bg-emerald-500' : 'bg-neutral-900'
      }`}>
        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p className="text-sm text-neutral-800 leading-relaxed">{t.message}</p>
    </div>
  )
}

// ─── Sidebar (light, luxury) ─────────────────────────────────────────────────

type PageId = 'dashboard' | 'portal' | 'interactive' | 'pricing' | 'faq'

const NAV_ITEMS: { id: PageId; label: string; hint?: string; Icon: () => JSX.Element }[] = [
  { id: 'dashboard',   label: 'Front Desk',       hint: 'What your staff sees',  Icon: DashboardIcon },
  { id: 'portal',      label: 'Client Portal',    hint: 'How your clients see you', Icon: PortalIcon },
  { id: 'interactive', label: 'Admin Panel',       hint: 'Org setup',             Icon: SettingsIcon },
  { id: 'pricing',     label: 'Pricing',          Icon: TagIcon },
  { id: 'faq',         label: 'FAQ',              Icon: HelpIcon },
]

function LuxurySidebar({ activePage, setActivePage }: { activePage: PageId; setActivePage: (id: PageId) => void }) {
  return (
    <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col bg-white border-r border-neutral-100 sticky top-0 h-screen">
      {/* Wordmark */}
      <div className="px-7 pt-8 pb-6">
        <h1 className="font-serif text-[28px] tracking-wide text-neutral-900 leading-none">Bridgeway</h1>
        <p className="text-[10px] text-neutral-400 mt-2 tracking-[0.2em] uppercase">Practice Management</p>
      </div>

      <div className="border-t border-neutral-100" />

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto luxury-scroll">
        {NAV_ITEMS.map(({ id, label, hint, Icon }) => {
          const active = activePage === id
          return (
            <button
              key={id}
              onClick={() => setActivePage(id)}
              className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                active
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <div className={`mt-0.5 ${active ? 'text-white' : 'text-neutral-400'}`}>
                <Icon />
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-medium ${active ? 'text-white' : 'text-neutral-800'}`}>{label}</p>
                {hint && (
                  <p className={`text-[11px] mt-0.5 ${active ? 'text-white/60' : 'text-neutral-400'}`}>{hint}</p>
                )}
              </div>
            </button>
          )
        })}
      </nav>

      {/* Footer CTAs */}
      <div className="px-4 py-5 border-t border-neutral-100 space-y-2.5">
        <div className="space-y-2">
          <button
            onClick={() => {
              const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
              const adminUrl = isLocal
                ? 'http://localhost:5177/?demo=true'
                : 'https://admin.bridgewayapps.com/?demo=true';
              window.location.href = adminUrl;
            }}
            className="w-full text-[13px] font-medium text-white bg-indigo-600 rounded-xl py-3 hover:bg-indigo-500 transition-colors shadow-sm"
          >
            Try Live Admin App
          </button>
          
          <button
            onClick={() => {
              const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
              const dashUrl = isLocal
                ? 'http://localhost:5173/?demo=true'
                : 'https://dashboard.bridgewayapps.com/?demo=true';
              window.location.href = dashUrl;
            }}
            className="w-full text-[13px] font-medium text-white bg-amber-500 rounded-xl py-3 hover:bg-amber-600 transition-colors shadow-sm"
          >
            Try Live Dashboard
          </button>
        </div>
        <button
          onClick={() => setActivePage('pricing')}
          className="w-full text-[13px] font-semibold text-white bg-neutral-900 rounded-xl py-3 hover:bg-neutral-800 transition-colors"
        >
          Get Started
        </button>
        <p className="text-[10px] text-neutral-400 text-center pt-1">&copy; {new Date().getFullYear()} Bridgeway Apps</p>
      </div>
    </aside>
  )
}

function MobileTopbar({ activePage, setActivePage }: { activePage: PageId; setActivePage: (id: PageId) => void }) {
  return (
    <div className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-neutral-100">
      <div className="flex items-center justify-between px-5 py-3.5">
        <h1 className="font-serif text-xl text-neutral-900 tracking-wide">Bridgeway</h1>
        <button
          onClick={() => setActivePage('pricing')}
          className="text-xs font-semibold text-white bg-neutral-900 rounded-lg px-3.5 py-2"
        >
          Get Started
        </button>
      </div>
      <div className="flex border-t border-neutral-100 overflow-x-auto hide-scrollbar">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const active = activePage === id
          return (
            <button
              key={id}
              onClick={() => setActivePage(id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                active ? 'text-neutral-900 border-neutral-900' : 'text-neutral-500 border-transparent'
              }`}
            >
              <Icon />
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// Section: Front Desk Dashboard preview
// ═════════════════════════════════════════════════════════════════════════════

type BookedAppt = { name: string; service: string; time: string; price: number } | null

function isLight(hex: string): boolean {
  const c = parseInt(hex.replace('#', ''), 16)
  const r = (c >> 16) & 0xff, g = (c >> 8) & 0xff, b = c & 0xff
  return (r * 299 + g * 587 + b * 114) / 1000 > 155
}

function apptStatusStyle(s: string) {
  if (s === 'confirmed')     return 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
  if (s === 'completed')     return 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
  if (s === 'with_provider') return 'bg-violet-500/10 text-violet-300 border border-violet-500/20'
  return 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
}

// Shared content area used by all 4 dashboard layout themes
function DashboardMainContent({
  portalCheckedIn, portalBookedAppt, confirmedIds, setConfirmedIds, waitMins,
  primaryColor, appTheme, showTabs,
}: {
  portalCheckedIn: boolean
  portalBookedAppt: BookedAppt
  confirmedIds: string[]
  setConfirmedIds: React.Dispatch<React.SetStateAction<string[]>>
  waitMins: number[]
  primaryColor: string
  appTheme: string
  showTabs: boolean
}) {
  const btnTextColor = isLight(primaryColor) ? '#1a1a1a' : '#ffffff'
  return (
    <>
      {showTabs && (
        <div className="flex items-center gap-0.5 mb-4 pb-2 border-b border-white/10 -mt-1">
          {['The Floor', 'Today', 'Upcoming', 'Reports'].map((tab, i) => (
            <div key={tab} className={`px-3 py-1.5 text-[11px] cursor-default ${i === 0 ? 'border-b-2' : ''}`}
                 style={i === 0 ? { color: primaryColor, borderColor: primaryColor } : { color: '#6B7280' }}>
              {tab}
            </div>
          ))}
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className={`text-white font-semibold ${appTheme === 'luxury' ? 'font-serif text-base tracking-wide' : 'text-sm'}`}>The Floor</h3>
          <p className="text-[11px] text-gray-500">Tuesday, live right now</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-emerald-300 font-medium">Live</span>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'In Session', value: '1',                           color: '#a78bfa' },
          { label: 'Waiting',    value: portalCheckedIn ? '3' : '2',   color: primaryColor },
          { label: 'Confirmed',  value: portalBookedAppt ? '5' : '4',  color: '#93c5fd' },
          { label: 'Revenue',    value: '$1,240',                      color: '#6ee7b7' },
        ].map(s => (
          <div key={s.label} className="bg-[#0f2136] border border-white/5 rounded-xl px-4 py-3">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{s.label}</p>
            <p className="text-xl font-semibold mt-1 tabular-nums" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>
      {/* Schedule + Waiting Room */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#0f2136] border border-white/5 rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-white/5 flex items-center justify-between">
            <h4 className={`text-white font-semibold ${appTheme === 'luxury' ? 'font-serif text-[13px] tracking-wide' : 'text-[12px]'}`}>Today's Schedule</h4>
            <span className="text-[10px] text-gray-500">{BASE_APPOINTMENTS.length + (portalBookedAppt ? 1 : 0)} appts</span>
          </div>
          <div className="divide-y divide-white/5 max-h-64 overflow-y-auto dark-scroll">
            {portalBookedAppt && (
              <div className="flex items-center justify-between px-4 py-2.5 bg-blue-500/5 animate-pulse-arrival">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-blue-300 font-mono w-10">{portalBookedAppt.time}</span>
                  <div>
                    <p className="text-[11px] text-white font-medium">{portalBookedAppt.name}</p>
                    <p className="text-[10px] text-gray-500">{portalBookedAppt.service}</p>
                  </div>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-medium bg-blue-500/15 text-blue-300 border border-blue-500/30">New</span>
              </div>
            )}
            {BASE_APPOINTMENTS.map((a, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-gray-500 font-mono w-10">{a.time}</span>
                  <div>
                    <p className="text-[11px] text-white font-medium">{a.name}</p>
                    <p className="text-[10px] text-gray-500">{a.service}</p>
                  </div>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium capitalize ${apptStatusStyle(a.status)}`}>
                  {a.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#0f2136] border border-white/5 rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-white/5 flex items-center justify-between">
            <h4 className={`text-white font-semibold ${appTheme === 'luxury' ? 'font-serif text-[13px] tracking-wide' : 'text-[12px]'}`}>Waiting Room</h4>
            <span className="text-[10px] text-gray-500">{portalCheckedIn ? 3 : 2} in queue</span>
          </div>
          <div className="divide-y divide-white/5">
            {portalCheckedIn && (
              <div className="flex items-center justify-between px-4 py-2.5 bg-blue-500/5 animate-pulse-arrival">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-300 text-[9px] font-bold">J</span>
                  </div>
                  <p className="text-[11px] text-white font-medium">James Wilson</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-gray-500">Just arrived</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-medium bg-blue-500/15 text-blue-300 border border-blue-500/30">Checked in</span>
                </div>
              </div>
            )}
            {[{ name: 'Lisa Park', idx: 0 }, { name: 'Marcus Brown', idx: 1 }].map(q => (
              <div key={q.name} className="flex items-center justify-between px-4 py-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                    <span className="text-gray-300 text-[9px] font-bold">{q.name.charAt(0)}</span>
                  </div>
                  <p className="text-[11px] text-white font-medium">{q.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-gray-500 tabular-nums">{waitMins[q.idx]} min</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-medium"
                        style={{ color: primaryColor, background: primaryColor + '18', border: `1px solid ${primaryColor}30` }}>
                    Waiting
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Bottom: Unconfirmed + Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2 bg-[#0f2136] border border-white/5 rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-white/5">
            <h4 className={`text-white font-semibold ${appTheme === 'luxury' ? 'font-serif text-[13px] tracking-wide' : 'text-[12px]'}`}>Unconfirmed Appointments</h4>
          </div>
          <div className="divide-y divide-white/5">
            {[
              { name: 'Kevin Nguyen',  when: 'Today · 11:00 AM', id: 'kevin' },
              { name: 'Sandra Turner', when: 'Today · 2:00 PM',  id: 'sandra' },
            ].map(u => (
              <div key={u.id} className="flex items-center justify-between px-4 py-2.5">
                <div>
                  <p className="text-[11px] text-white font-medium">{u.name}</p>
                  <p className="text-[10px] text-gray-500">{u.when}</p>
                </div>
                {confirmedIds.includes(u.id) ? (
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">Confirmed</span>
                ) : (
                  <button
                    onClick={() => setConfirmedIds(p => [...p, u.id])}
                    className="text-[10px] font-medium px-2.5 py-1 rounded-md transition-colors"
                    style={{ color: btnTextColor, background: primaryColor, border: `1px solid ${primaryColor}` }}
                  >
                    Confirm
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#0f2136] border border-white/5 rounded-xl p-4">
          <h4 className={`text-white font-semibold mb-1 ${appTheme === 'luxury' ? 'font-serif text-[13px] tracking-wide' : 'text-[12px]'}`}>Today's Revenue</h4>
          <p className="text-2xl font-semibold text-white tabular-nums mt-2">$1,240</p>
          <p className="text-[10px] text-emerald-400 mt-0.5">+18% vs last Tuesday</p>
          <div className="flex items-end gap-1 mt-4 h-12">
            {[32, 48, 40, 62, 55, 68, 78].map((h, i) => (
              <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: primaryColor + '4d' }} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

const BASE_APPOINTMENTS = [
  { time: '9:00',  name: 'James Wilson',    service: 'Adjustment',         status: 'with_provider' },
  { time: '9:30',  name: 'Lisa Park',       service: 'Massage — 60 min',   status: 'confirmed' },
  { time: '10:00', name: 'David Martinez',  service: 'Initial Consult',    status: 'confirmed' },
  { time: '10:30', name: 'Angela Thompson', service: 'Group Class',        status: 'completed' },
]

function DashboardSection({
  portalCheckedIn,
  portalBookedAppt,
  onGoToPortal,
  primaryColor,
  layoutTheme,
  appTheme,
}: {
  portalCheckedIn: boolean
  portalBookedAppt: BookedAppt
  onGoToPortal: () => void
  primaryColor: string
  layoutTheme: string
  appTheme: string
}) {
  const [confirmedIds, setConfirmedIds] = useState<string[]>([])
  const [waitMins, setWaitMins] = useState([8, 3])
  useEffect(() => {
    const iv = setInterval(() => setWaitMins(p => p.map(m => m + 1)), 60000)
    return () => clearInterval(iv)
  }, [])

  const contentProps = { portalCheckedIn, portalBookedAppt, confirmedIds, setConfirmedIds, waitMins, primaryColor, appTheme }

  return (
    <div className="min-h-screen">
      {/* Luxury hero header */}
      <section className="bg-neutral-50 px-8 lg:px-16 pt-16 lg:pt-24 pb-10">
        <div className="max-w-5xl">
          <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-[0.25em] mb-5">The Front Desk</p>
          <h2 className="font-serif text-4xl lg:text-5xl text-neutral-900 leading-[1.1] tracking-tight mb-5">
            A full work day<br />
            at your fingertips.
          </h2>
          <p className="text-base lg:text-lg text-neutral-500 leading-relaxed max-w-2xl font-light">
            Today's schedule, the waiting room, and unconfirmed appointments — all visible at a glance.
            No toggling between systems. No staff training.
          </p>
        </div>
      </section>

      {/* Dark Dashboard mock — matches the real app */}
      <section className="px-8 lg:px-16 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-[28px] border border-neutral-100 bg-white p-3 shadow-[0_20px_60px_rgb(0,0,0,0.08)]">
            <div className="rounded-[20px] bg-[#0c1a2e] overflow-hidden">

              {/* Fake browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-[#08121f] border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-[11px] text-gray-500 tracking-wide">dashboard.bridgewayapps.com</span>
                </div>
              </div>

              {layoutTheme === 'executive' ? (
                /* Executive: horizontal top nav bar */
                <div className="min-h-[560px]">
                  <div className="flex items-center gap-1 px-3 py-2 bg-[#080f1d] border-b border-white/5 overflow-x-auto hide-scrollbar">
                    <div className="flex items-center gap-2 mr-3 flex-shrink-0">
                      <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: primaryColor + '25' }}>
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: primaryColor }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5z" />
                        </svg>
                      </div>
                      <span className={`text-white text-[11px] font-semibold ${appTheme === 'luxury' ? 'font-serif' : ''}`}>Wellness Co</span>
                    </div>
                    {['The Floor', 'Schedule', 'Clients', 'Services', 'Reports', 'Settings'].map((item, i) => (
                      <div key={item} className="px-2.5 py-1.5 rounded-md text-[11px] whitespace-nowrap flex-shrink-0"
                           style={i === 0 ? { color: primaryColor, background: primaryColor + '18' } : { color: '#6B7280' }}>
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#0c1a2e] p-5 overflow-hidden">
                    <DashboardMainContent {...contentProps} showTabs={false} />
                  </div>
                </div>
              ) : (
                /* Modern / Minimal / Classic: left sidebar */
                <div className="grid grid-cols-12 min-h-[560px]">
                  <div className={`${layoutTheme === 'minimal' ? 'col-span-1 px-1.5 flex flex-col items-center' : 'col-span-2 px-3'} bg-[#080f1d] border-r border-white/5 py-4`}>
                    {layoutTheme === 'minimal' ? (
                      <>
                        <div className="w-5 h-5 rounded-md mb-5 flex items-center justify-center flex-shrink-0" style={{ background: primaryColor + '25' }}>
                          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: primaryColor }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5z" />
                          </svg>
                        </div>
                        <div className="space-y-3">
                          {[true, false, false, false, false, false, false].map((active, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full mx-auto"
                                 style={{ background: active ? primaryColor : '#374151' }} />
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 px-2 pb-4 border-b border-white/5">
                          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: primaryColor + '25' }}>
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: primaryColor }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5z" />
                            </svg>
                          </div>
                          <span className={`text-white text-[11px] font-semibold ${appTheme === 'luxury' ? 'font-serif' : ''}`}>Wellness Co</span>
                        </div>
                        <div className="space-y-0.5 pt-3 text-[11px]">
                          {[
                            { label: 'The Floor',   active: true  },
                            { label: 'Schedule',    active: false },
                            { label: 'Clients',     active: false },
                            { label: 'Services',    active: false },
                            { label: 'Memberships', active: false },
                            { label: 'Reports',     active: false },
                            { label: 'Settings',    active: false },
                          ].map(item => (
                            <div key={item.label} className="px-2.5 py-1.5 rounded-md"
                                 style={item.active ? { background: primaryColor + '1a', color: primaryColor } : { color: '#6B7280' }}>
                              {item.label}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <div className={`${layoutTheme === 'minimal' ? 'col-span-11' : 'col-span-10'} bg-[#0c1a2e] p-5 overflow-hidden`}>
                    <DashboardMainContent {...contentProps} showTabs={layoutTheme === 'classic'} />
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Caption */}
          <div className="mt-5 flex items-center justify-between flex-wrap gap-3 px-2">
            <p className="text-xs text-neutral-400">
              This is a live preview. Check in as a client on the Portal tab — you'll appear here instantly.
            </p>
            <button
              onClick={onGoToPortal}
              className="text-xs font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
            >
              Switch to Client Portal →
            </button>
          </div>
        </div>
      </section>

      {/* Luxury feature strip */}
      <section className="bg-white px-8 lg:px-16 py-16 border-t border-neutral-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              h: 'Everything at a glance',
              p: 'Schedule, waiting room, unconfirmed appointments, and live revenue — all on one screen.',
            },
            {
              h: 'Real-time waiting room',
              p: "When a client checks in from their phone, they appear in the queue instantly — no staff intervention.",
            },
            {
              h: 'Built for the front desk',
              p: 'Configurable widget grid means each location shows exactly what their staff needs, nothing more.',
            },
          ].map((c, i) => (
            <div key={i}>
              <div className="w-8 h-[1px] bg-neutral-900 mb-5" />
              <h3 className="font-serif text-xl text-neutral-900 tracking-tight mb-2.5">{c.h}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed font-light">{c.p}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// Section: Client Portal preview
// ═════════════════════════════════════════════════════════════════════════════

function ClientPortalSection({
  portalCheckedIn,
  onCheckIn,
  portalBookedAppt,
  onBookAppt,
  onGoToDashboard,
  primaryColor,
  appTheme,
}: {
  portalCheckedIn: boolean
  onCheckIn: () => void
  portalBookedAppt: BookedAppt
  onBookAppt: (a: NonNullable<BookedAppt>) => void
  onGoToDashboard: () => void
  primaryColor: string
  appTheme: string
}) {
  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3>(1)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  function resetBooking() {
    setBookingOpen(false)
    setBookingStep(1)
    setSelectedService(null)
    setSelectedSlot(null)
  }

  function confirmBooking() {
    if (!selectedService || !selectedSlot) return
    onBookAppt({
      name: 'James Wilson',
      service: selectedService,
      time: selectedSlot,
      price: selectedService.includes('Adjustment') ? 85 : 150,
    })
    resetBooking()
  }

  return (
    <div className="min-h-screen">
      {/* Luxury hero header */}
      <section className="bg-neutral-50 px-8 lg:px-16 pt-16 lg:pt-24 pb-10">
        <div className="max-w-5xl">
          <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-[0.25em] mb-5">The Client Portal</p>
          <h2 className="font-serif text-4xl lg:text-5xl text-neutral-900 leading-[1.1] tracking-tight mb-5">
            How your clients see<br />
            your practice.
          </h2>
          <p className="text-base lg:text-lg text-neutral-500 leading-relaxed max-w-2xl font-light">
            Booking, check-in, intake forms, documents — all on their phone, under your brand.
          </p>
        </div>
      </section>

      {/* Phone mock + interactions */}
      <section className="px-8 lg:px-16 pb-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

          {/* Phone frame */}
          <div className="lg:col-span-3 flex justify-center">
            <div className="relative w-[340px] max-w-full">
              {/* Phone outer */}
              <div className="rounded-[44px] bg-neutral-900 p-2.5 shadow-[0_30px_80px_rgb(0,0,0,0.15)]">
                {/* Notch */}
                <div className="relative rounded-[36px] bg-white overflow-hidden">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-neutral-900 rounded-full z-10" />

                  {/* Status bar */}
                  <div className="flex items-center justify-between px-6 pt-4 pb-1 text-[10px] text-neutral-800 font-medium">
                    <span className="tabular-nums">9:41</span>
                    <span className="flex items-center gap-1">
                      <span>●●●</span>
                      <span>WiFi</span>
                      <span>◼</span>
                    </span>
                  </div>

                  {/* Portal content */}
                  <div className="h-[600px] overflow-y-auto luxury-scroll px-6 pt-10 pb-6 bg-neutral-50">
                    {/* Brand header */}
                    <div className="flex items-center gap-2.5 mb-7 pt-1">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: primaryColor }}>
                        <svg className="w-4 h-4" style={{ color: isLight(primaryColor) ? '#1a1a1a' : '#ffffff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5z" />
                        </svg>
                      </div>
                      <div>
                        <p className={`text-base text-neutral-900 leading-none ${appTheme === 'luxury' ? 'font-serif' : 'font-semibold'}`}>Wellness Co</p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">Hi, James</p>
                      </div>
                    </div>

                    {/* Next appointment card */}
                    {(portalBookedAppt || true) && !portalCheckedIn && (
                      <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 mb-4">
                        <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest mb-2">Next Visit</p>
                        <p className="font-serif text-lg text-neutral-900 leading-tight">
                          {portalBookedAppt ? portalBookedAppt.service : 'Adjustment'}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          Today at {portalBookedAppt ? portalBookedAppt.time : '9:00 AM'}
                        </p>
                        <p className="text-xs text-neutral-500">with Dr. Peterson</p>

                        {portalCheckedIn ? (
                          <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 flex items-center gap-2">
                            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <p className="text-xs font-medium text-emerald-700">You're checked in. Take a seat.</p>
                          </div>
                        ) : (
                          <button
                            onClick={onCheckIn}
                            className="mt-4 w-full text-sm font-medium rounded-xl py-3 transition-colors"
                            style={{ background: primaryColor, color: isLight(primaryColor) ? '#1a1a1a' : '#ffffff' }}
                          >
                            I'm Here — Check Me In
                          </button>
                        )}
                      </div>
                    )}

                    {portalCheckedIn && (
                      <div className="bg-white rounded-2xl border border-emerald-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <p className="text-xs font-medium text-emerald-700">Checked in</p>
                        </div>
                        <p className="font-serif text-lg text-neutral-900 leading-tight">
                          Please take a seat
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          Dr. Peterson will be with you shortly.
                        </p>
                      </div>
                    )}

                    {/* Quick actions */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <button
                        onClick={() => setBookingOpen(true)}
                        className="bg-white rounded-2xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 text-left hover:border-neutral-200 transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center mb-2.5">
                          <svg className="w-3.5 h-3.5 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className={`text-xs text-neutral-900 ${appTheme === 'luxury' ? 'font-serif' : 'font-semibold'}`}>Book</p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">New appointment</p>
                      </button>

                      <button className="bg-white rounded-2xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 text-left hover:border-neutral-200 transition-colors">
                        <div className="w-7 h-7 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center mb-2.5">
                          <svg className="w-3.5 h-3.5 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className={`text-xs text-neutral-900 ${appTheme === 'luxury' ? 'font-serif' : 'font-semibold'}`}>Forms</p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">1 pending</p>
                      </button>
                    </div>

                    {/* Recent visits */}
                    <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest mb-2.5 mt-3">Recent Visits</p>
                    <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] divide-y divide-neutral-100">
                      {[
                        { svc: 'Adjustment',    when: 'Apr 12' },
                        { svc: 'Massage 60min', when: 'Mar 28' },
                      ].map((v, i) => (
                        <div key={i} className="flex items-center justify-between px-5 py-3">
                          <div>
                            <p className={`text-xs text-neutral-800 ${appTheme === 'luxury' ? 'font-serif' : 'font-medium'}`}>{v.svc}</p>
                            <p className="text-[10px] text-neutral-400 mt-0.5">{v.when}</p>
                          </div>
                          <span className="text-[10px] text-neutral-400">Completed</span>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copy + interactions */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="w-8 h-[1px] bg-neutral-900 mb-5" />
              <h3 className="font-serif text-2xl text-neutral-900 tracking-tight mb-3">Your brand, their pocket.</h3>
              <p className="text-sm text-neutral-500 leading-relaxed font-light">
                The portal is themed to your practice — colors, logo, copy, even the terminology.
                Clients don't realize they're using third-party software.
              </p>
            </div>

            <div>
              <div className="w-8 h-[1px] bg-neutral-900 mb-5" />
              <h3 className="font-serif text-2xl text-neutral-900 tracking-tight mb-3">Check-in that just works.</h3>
              <p className="text-sm text-neutral-500 leading-relaxed font-light mb-4">
                Clients press one button on arrival. Your front desk sees them immediately, with timestamps,
                wait duration, and intake status. No clipboard. No sign-in sheet.
              </p>
              <button
                onClick={onGoToDashboard}
                className="text-xs font-medium text-neutral-700 hover:text-neutral-900 transition-colors inline-flex items-center gap-1"
              >
                See the staff view
                <span>→</span>
              </button>
            </div>

            <div>
              <div className="w-8 h-[1px] bg-neutral-900 mb-5" />
              <h3 className="font-serif text-2xl text-neutral-900 tracking-tight mb-3">Built for repeat business.</h3>
              <p className="text-sm text-neutral-500 leading-relaxed font-light">
                Past visits, forms, documents, and memberships all live in the portal. Clients return on their own,
                book on their own, and keep coming back.
              </p>
            </div>
          </div>
        </div>

        {/* Try it instruction */}
        <div className="max-w-6xl mx-auto mt-10 bg-white border border-neutral-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] px-8 py-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-medium text-neutral-400 uppercase tracking-widest">Try It</p>
            <p className="font-serif text-lg text-neutral-900 mt-1">
              Tap "I'm Here" on the phone above, then switch to Front Desk to watch the queue update live.
            </p>
          </div>
          <button
            onClick={onGoToDashboard}
            className="text-sm font-semibold text-white bg-neutral-900 rounded-xl px-5 py-2.5 hover:bg-neutral-800 transition-colors flex-shrink-0"
          >
            Go to Front Desk →
          </button>
        </div>
      </section>

      {/* Booking modal overlay */}
      {bookingOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-soft"
          onClick={resetBooking}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-neutral-100"
          >
            {/* Modal header */}
            <div className="px-8 pt-7 pb-5 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest">Step {bookingStep} of 3</p>
                <h3 className="font-serif text-2xl text-neutral-900 mt-1">
                  {bookingStep === 1 && 'Choose a service'}
                  {bookingStep === 2 && 'Pick a time'}
                  {bookingStep === 3 && 'Confirm'}
                </h3>
              </div>
              <button onClick={resetBooking} className="text-neutral-400 hover:text-neutral-600 text-xl leading-none">×</button>
            </div>

            <div className="px-8 py-7 min-h-[280px]">
              {bookingStep === 1 && (
                <div className="space-y-2.5 animate-fade-in">
                  {[
                    { svc: 'Adjustment',        dur: '30 min', price: 85 },
                    { svc: 'Massage — 60 min',  dur: '60 min', price: 120 },
                    { svc: 'Initial Consult',   dur: '45 min', price: 150 },
                  ].map(o => (
                    <button
                      key={o.svc}
                      onClick={() => { setSelectedService(o.svc); setBookingStep(2) }}
                      className="w-full flex items-center justify-between px-5 py-4 border border-neutral-100 rounded-2xl hover:border-neutral-900 hover:bg-neutral-50 transition-colors text-left"
                    >
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">{o.svc}</p>
                        <p className="text-xs text-neutral-400 mt-0.5">{o.dur}</p>
                      </div>
                      <p className="text-sm font-semibold text-neutral-900 tabular-nums">${o.price}</p>
                    </button>
                  ))}
                </div>
              )}

              {bookingStep === 2 && (
                <div className="animate-fade-in">
                  <p className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-4">Tuesday, today</p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {['11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM', '2:00 PM', '3:30 PM'].map(t => (
                      <button
                        key={t}
                        onClick={() => { setSelectedSlot(t); setBookingStep(3) }}
                        className="py-3 border border-neutral-100 rounded-xl text-sm font-medium text-neutral-700 hover:border-neutral-900 hover:bg-neutral-50 transition-colors"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {bookingStep === 3 && (
                <div className="animate-fade-in">
                  <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-6 mb-5">
                    <p className="text-xs font-medium text-neutral-400 uppercase tracking-widest">Summary</p>
                    <p className="font-serif text-xl text-neutral-900 mt-1.5">{selectedService}</p>
                    <p className="text-sm text-neutral-500 mt-0.5">Today at {selectedSlot}</p>
                    <p className="text-sm text-neutral-500">with Dr. Peterson</p>
                  </div>
                  <button
                    onClick={confirmBooking}
                    className="w-full bg-neutral-900 text-white text-sm font-semibold rounded-2xl py-3.5 hover:bg-neutral-800 transition-colors"
                  >
                    Confirm Booking
                  </button>
                </div>
              )}
            </div>

            {bookingStep > 1 && (
              <div className="px-8 pb-6">
                <button
                  onClick={() => setBookingStep((s) => (s - 1) as 1 | 2)}
                  className="text-xs font-medium text-neutral-400 hover:text-neutral-700 transition-colors"
                >
                  ← Back
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// Section: Pricing (Stripe checkout)
// ═════════════════════════════════════════════════════════════════════════════

function PricingSection() {
  const [form, setForm] = useState({ practice: '', email: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({})
  const [selectedPlan, setSelectedPlan] = useState<'booking' | 'full'>('full')

  const priceBooking    = import.meta.env.PUBLIC_STRIPE_PRICE_BOOKING || 'price_1TQG6JJRMfcFhxi8uagAAgis'
  const priceFull       = import.meta.env.PUBLIC_STRIPE_PRICE_FULL    || 'price_1TQG85JRMfcFhxi8TK6bpIBU'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, boolean> = {}
    if (!form.practice.trim()) errs.practice = true
    if (!form.email.trim())    errs.email    = true
    if (Object.keys(errs).length) { setFieldErrors(errs); return }
    setSubmitting(true)
    setError(null)
    try {
      const { httpsCallable } = await import('firebase/functions')
      const { functions } = await import('../lib/firebase')
      const createCheckoutSession = httpsCallable(functions, 'createCheckoutSession')
      
      const result = await createCheckoutSession({
        email: form.email.trim(), 
        orgName: form.practice.trim(), 
        priceId: selectedPlan === 'booking' ? priceBooking : priceFull,
        subscriptionTier: selectedPlan === 'booking' ? 'booking-only' : 'full-stack'
      })
      
      const data = result.data as { url?: string }
      if (data?.url) window.location.href = data.url
      else throw new Error('No checkout URL returned')
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  const inputCls = (field: string) =>
    `w-full bg-white border ${fieldErrors[field] ? 'border-red-200' : 'border-neutral-100'} rounded-2xl text-sm text-neutral-900 placeholder-neutral-300 px-5 py-3.5 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-colors`

  const featuresBooking = [
    'Public booking page + embeddable widget',
    'Class scheduling & waitlist management',
    'Connects to your existing Calendar',
    'Unlimited clients and appointments',
    'No per-user fees',
  ]

  const featuresFull = [
    'Dashboard with configurable widgets',
    'Client portal with self check-in',
    'Intake forms & patient documents',
    'Memberships & recurring revenue',
    'POS checkout with Stripe',
    'Walk-in queue with kiosk mode',
    'Admin panel with full user management',
    'Automated SMS & email reminders',
    'Up to 10 staff accounts included',
    'White-glove onboarding',
  ]

  return (
    <div className="min-h-screen">
      {/* Luxury hero header */}
      <section className="bg-neutral-50 px-8 lg:px-16 pt-16 lg:pt-24 pb-10">
        <div className="max-w-5xl">
          <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-[0.25em] mb-5">Pricing</p>
          <h2 className="font-serif text-4xl lg:text-5xl text-neutral-900 leading-[1.1] tracking-tight mb-5">
            Two simple plans.<br />
            No hidden fees.
          </h2>
          <p className="text-base lg:text-lg text-neutral-500 leading-relaxed max-w-2xl font-light">
            Whether you just need a better booking experience, or a complete system to run your entire practice.
          </p>
        </div>
      </section>

      <section className="px-8 lg:px-16 pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Plans Selection */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Booking Only Plan */}
            <button 
              type="button"
              onClick={() => setSelectedPlan('booking')}
              className={`text-left transition-all rounded-3xl p-8 border ${
                selectedPlan === 'booking' 
                  ? 'bg-white border-neutral-900 shadow-xl ring-1 ring-neutral-900' 
                  : 'bg-white/50 border-neutral-200 hover:border-neutral-300 hover:bg-white'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-serif text-2xl text-neutral-900 tracking-tight">Booking Only</h3>
                <span className="text-[10px] text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full font-medium tracking-widest uppercase mt-1">
                  Standalone
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-4 mb-6">
                <span className="font-serif text-4xl text-neutral-900 tracking-tight">$105</span>
                <span className="text-sm text-neutral-400 ml-2">/ month</span>
              </div>
              <div className="space-y-2.5">
                {featuresBooking.map(f => (
                  <div key={f} className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-neutral-900 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-neutral-600 font-light leading-relaxed">{f}</span>
                  </div>
                ))}
              </div>
            </button>

            {/* Full Stack Plan */}
            <button 
              type="button"
              onClick={() => setSelectedPlan('full')}
              className={`text-left transition-all rounded-3xl p-8 border ${
                selectedPlan === 'full' 
                  ? 'bg-white border-neutral-900 shadow-xl ring-1 ring-neutral-900' 
                  : 'bg-white/50 border-neutral-200 hover:border-neutral-300 hover:bg-white'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-serif text-2xl text-neutral-900 tracking-tight">Full Service</h3>
                <span className="text-[10px] text-neutral-900 bg-neutral-200 px-2.5 py-1 rounded-full font-medium tracking-widest uppercase mt-1">
                  Everything
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-4 mb-2">
                <span className="font-serif text-4xl text-neutral-900 tracking-tight">$375</span>
                <span className="text-sm text-neutral-400 ml-2">/ month</span>
              </div>
              <p className="text-xs text-neutral-400 mb-6">
                Includes everything in Booking Only, plus:
              </p>
              <div className="space-y-2.5">
                {featuresFull.map(f => (
                  <div key={f} className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-neutral-900 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-neutral-600 font-light leading-relaxed">{f}</span>
                  </div>
                ))}
              </div>
            </button>
          </div>

          {/* Sign-up form */}
          <div className="lg:col-span-5 sticky top-8 bg-white border border-neutral-100 rounded-3xl p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="font-serif text-3xl text-neutral-900 tracking-tight mb-2">Get Started</h3>
            <p className="text-sm text-neutral-500 font-light mb-7">
              Enter your details — you'll be taken straight to our secure checkout.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 mb-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-medium text-neutral-400 uppercase tracking-[0.2em] mb-2.5">
                  Practice Name
                </label>
                <input
                  type="text"
                  value={form.practice}
                  onChange={e => { setForm(f => ({ ...f, practice: e.target.value })); setFieldErrors(v => ({ ...v, practice: false })) }}
                  className={inputCls('practice')}
                  placeholder="Wellness Co"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-neutral-400 uppercase tracking-[0.2em] mb-2.5">
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
                className="w-full font-semibold text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 rounded-2xl px-6 py-4 text-sm transition-colors mt-2"
              >
                {submitting ? 'Redirecting to checkout…' : 'Continue to Payment →'}
              </button>
            </form>
            <p className="text-[11px] text-neutral-400 text-center mt-5 font-light">
              Secure checkout via Stripe. Cancel anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// Section: FAQ
// ═════════════════════════════════════════════════════════════════════════════

function FAQSection() {
  const [open, setOpen] = useState<number | null>(0)

  const faqs = [
    {
      q: 'Is Bridgeway HIPAA compliant?',
      a: 'Bridgeway is strictly administrative software. We do not store medical records, treatment notes, diagnoses, or any protected health information. Appointment scheduling, client contact details, and administrative documents only — the same category of data as a paper appointment book or Google Calendar.',
    },
    {
      q: 'What software does Bridgeway replace?',
      a: 'Bridgeway is designed to sit alongside your existing clinical software, not replace it. If you use a clinical records system for charting or billing, keep it. Bridgeway handles your front desk operations — the parts clinical systems do poorly. For practices without existing software, Bridgeway can serve as your complete administrative stack.',
    },
    {
      q: 'Does Bridgeway handle payments?',
      a: 'Yes. Clients can pay at booking through the portal, or staff can process payments at checkout using the built-in POS. Bridgeway connects to your own Stripe account — you get paid directly, with no middleman.',
    },
    {
      q: "Can I use Bridgeway if my clients aren't \"patients\"?",
      a: 'Absolutely. Bridgeway works for any appointment-based business. The terminology throughout the app — "client," "patient," "member" — is fully customizable to match how your business talks. Everything from dashboard labels to the portal greeting reflects your own language.',
    },
    {
      q: 'How does setup work?',
      a: 'When you sign up, we personally onboard your practice. We set up your account, import your services and staff, configure your widgets, and make sure everything looks right before you go live. Most practices are fully set up within 48 hours.',
    },
    {
      q: 'What kinds of businesses use Bridgeway?',
      a: 'Bridgeway is built for any appointment-based business — chiropractic offices, massage therapy, yoga and fitness studios, barbershops, salons, personal training, med spas, tattoo studios, and more. If you have a front desk, a schedule, and clients, Bridgeway was built for you.',
    },
  ]

  return (
    <div className="min-h-screen">
      <section className="bg-neutral-50 px-8 lg:px-16 pt-16 lg:pt-24 pb-10">
        <div className="max-w-5xl">
          <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-[0.25em] mb-5">FAQ</p>
          <h2 className="font-serif text-4xl lg:text-5xl text-neutral-900 leading-[1.1] tracking-tight mb-5">
            Questions, answered.
          </h2>
          <p className="text-base lg:text-lg text-neutral-500 leading-relaxed max-w-2xl font-light">
            The questions we hear most often from practice owners and office managers.
          </p>
        </div>
      </section>

      <section className="px-8 lg:px-16 pb-24">
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border border-neutral-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-start justify-between gap-6 px-8 py-5 text-left"
              >
                <span className="font-serif text-lg text-neutral-900 leading-snug">{faq.q}</span>
                <svg
                  className={`w-4 h-4 text-neutral-400 flex-shrink-0 transition-transform mt-2 ${open === i ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === i && (
                <div className="px-8 pb-6 -mt-1 animate-fade-in">
                  <p className="text-sm text-neutral-500 leading-relaxed font-light">{faq.a}</p>
                </div>
              )}
            </div>
          ))}

          <div className="text-center pt-10">
            <p className="text-sm text-neutral-500 font-light">
              Still have questions?{' '}
              <a href="mailto:contact@bridgewayapps.com" className="text-neutral-900 underline underline-offset-4 hover:text-neutral-700 transition-colors">
                contact@bridgewayapps.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

// ─── Admin Panel Section ──────────────────────────────────────────────────────

const LAYOUT_THEMES = [
  {
    id: 'modern', label: 'Modern', desc: 'Sidebar nav, card-based, colorful accents',
    preview: (
      <div className="flex gap-1 h-14 w-full">
        <div className="w-5 bg-gray-700 rounded-sm" />
        <div className="flex-1 flex flex-col gap-1">
          <div className="h-2 bg-gray-700/40 rounded-sm" />
          <div className="flex-1 grid grid-cols-2 gap-1">
            <div className="bg-gray-700/30 rounded-sm" /><div className="bg-gray-700/30 rounded-sm" />
            <div className="bg-gray-700/30 rounded-sm" /><div className="bg-gray-700/30 rounded-sm" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'executive', label: 'Executive', desc: 'Top nav, table-focused, professional',
    preview: (
      <div className="flex flex-col gap-1 h-14 w-full">
        <div className="h-2.5 bg-gray-700 rounded-sm" />
        <div className="flex-1 flex flex-col gap-0.5 px-1">
          <div className="h-1.5 bg-gray-700/40 rounded-sm" /><div className="h-1.5 bg-gray-700/25 rounded-sm" />
          <div className="h-1.5 bg-gray-700/40 rounded-sm" /><div className="h-1.5 bg-gray-700/25 rounded-sm" />
          <div className="h-1.5 bg-gray-700/40 rounded-sm" />
        </div>
      </div>
    ),
  },
  {
    id: 'minimal', label: 'Minimal', desc: 'Ultra-clean, maximum whitespace',
    preview: (
      <div className="flex gap-1 h-14 w-full">
        <div className="w-2.5 bg-gray-700/60 rounded-sm" />
        <div className="flex-1 flex flex-col gap-2 py-1 px-1">
          <div className="h-1 bg-gray-700/30 rounded-sm w-2/3" /><div className="h-px bg-gray-700/20" />
          <div className="h-1 bg-gray-700/30 rounded-sm w-1/2" /><div className="h-px bg-gray-700/20" />
          <div className="h-1 bg-gray-700/30 rounded-sm w-3/4" />
        </div>
      </div>
    ),
  },
  {
    id: 'classic', label: 'Classic', desc: 'Tab nav, high density, enterprise layout',
    preview: (
      <div className="flex gap-1 h-14 w-full">
        <div className="w-4 bg-gray-700/80 rounded-sm flex flex-col gap-0.5 p-0.5">
          <div className="h-1 bg-gray-600 rounded-sm" /><div className="h-1 bg-gray-600/50 rounded-sm" /><div className="h-1 bg-gray-600/50 rounded-sm" />
        </div>
        <div className="flex-1 flex flex-col gap-0.5">
          <div className="flex gap-0.5">
            <div className="h-2 flex-1 bg-gray-700/50 rounded-sm" /><div className="h-2 flex-1 bg-gray-700/30 rounded-sm" /><div className="h-2 flex-1 bg-gray-700/30 rounded-sm" />
          </div>
          <div className="flex-1 bg-gray-700/20 rounded-sm" />
        </div>
      </div>
    ),
  },
]

const DEMO_WIDGETS = [
  { id: 'theFloor',                label: 'The Floor' },
  { id: 'todaySchedule',           label: "Today's Schedule" },
  { id: 'waitingRoom',             label: 'Waiting Room' },
  { id: 'unconfirmedAppointments', label: 'Unconfirmed Appointments' },
  { id: 'revenue',                 label: 'Revenue' },
  { id: 'clientRetention',         label: 'Client Retention' },
  { id: 'staffRoster',             label: 'Staff Roster' },
  { id: 'classSchedule',           label: 'Class Schedule' },
  { id: 'waitlistManager',         label: 'Waitlist Manager' },
  { id: 'packageTracker',          label: 'Package Tracker' },
]

const ADMIN_NAV = [
  { label: 'Home' },
  { label: 'Org Setup', active: true },
  { label: 'Billing' },
  { label: 'User Management' },
]

function AdminPanelSection({
  onGoToPricing,
  primaryColor,
  onPrimaryColorChange,
  layoutTheme,
  onLayoutThemeChange,
  appTheme,
  onAppThemeChange,
}: {
  onGoToPricing: () => void
  primaryColor: string
  onPrimaryColorChange: (c: string) => void
  layoutTheme: string
  onLayoutThemeChange: (t: string) => void
  appTheme: string
  onAppThemeChange: (t: string) => void
}) {
  const [saveStatus, setSaveStatus]           = useState<'idle' | 'saving' | 'saved'>('idle')
  const [disabledWidgets, setDisabledWidgets] = useState(['classSchedule', 'waitlistManager'])
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function triggerSave() {
    setSaveStatus('saving')
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      setSaveStatus('saved')
      saveTimer.current = setTimeout(() => setSaveStatus('idle'), 2000)
    }, 700)
  }

  function toggleWidget(id: string) {
    setDisabledWidgets(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id])
    triggerSave()
  }

  return (
    <div className="px-8 py-14 max-w-5xl">
      {/* Section intro */}
      <div className="mb-10">
        <p className="text-xs tracking-[0.18em] uppercase text-neutral-400 mb-4">THE ADMIN PANEL</p>
        <h2 className="font-serif text-4xl md:text-5xl text-neutral-900 leading-[1.1] mb-5">
          Your practice,<br />your way.
        </h2>
        <p className="text-neutral-500 font-light text-lg leading-relaxed max-w-xl">
          Brand colors, layout themes, widget visibility, session timeouts — every setting lives in a single org-setup panel. Changes propagate to every staff member instantly.
        </p>
      </div>

      {/* Browser chrome */}
      <div className="rounded-2xl overflow-hidden border border-neutral-200 shadow-[0_8px_40px_rgb(0,0,0,0.07)]">
        {/* Title bar */}
        <div className="bg-neutral-100 px-4 py-3 flex items-center gap-3 border-b border-neutral-200">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
            <div className="w-3 h-3 rounded-full bg-green-400/80" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-white rounded-md px-3 py-1 text-xs text-neutral-500 border border-neutral-200 min-w-[220px] text-center font-mono">
              admin.bridgewayapps.com
            </div>
          </div>
        </div>

        {/* App shell */}
        <div className="bg-gray-950 flex" style={{ minHeight: '620px' }}>
          {/* Admin sidebar */}
          <div className="w-48 flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col py-6">
            <div className="px-4 mb-8">
              <p className="text-white font-semibold text-sm">Wellness Co</p>
              <p className="text-gray-500 text-xs mt-0.5">Admin Panel</p>
            </div>
            <nav className="space-y-0.5 px-2">
              {ADMIN_NAV.map(({ label, active }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm cursor-default transition-colors"
                  style={active
                    ? { backgroundColor: primaryColor + '22', color: primaryColor }
                    : { color: '#6B7280' }
                  }
                >
                  <span className={active ? 'font-medium' : ''}>{label}</span>
                </div>
              ))}
            </nav>
          </div>

          {/* OrgSetup content */}
          <div className="flex-1 overflow-y-auto dark-scroll">
            <div className="p-8 max-w-2xl">
              {/* Page header */}
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-xl font-semibold text-white">Org Setup</h1>
                  <p className="text-sm text-gray-500 mt-1">Changes save automatically.</p>
                </div>
                <div className="text-sm pt-1 flex-shrink-0 w-20 text-right">
                  {saveStatus === 'saving' && <span className="text-gray-400">Saving…</span>}
                  {saveStatus === 'saved'  && <span className="text-green-400">Saved ✓</span>}
                </div>
              </div>

              <div className="space-y-6">
                {/* Practice Info */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h2 className="text-sm font-semibold text-white mb-4">Practice Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Practice Name</label>
                      <input type="text" defaultValue="Wellness Co" readOnly
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none cursor-default" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Address</label>
                      <input type="text" defaultValue="42 Meridian Ave, Suite 300, Austin, TX 78701" readOnly
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none cursor-default" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Phone</label>
                        <input type="text" defaultValue="(512) 555-0142" readOnly
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none cursor-default" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Website</label>
                        <input type="text" defaultValue="wellnessco.com" readOnly
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none cursor-default" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Branding */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h2 className="text-sm font-semibold text-white mb-4">Branding</h2>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Logo</label>
                      <p className="text-xs text-gray-500 mb-3">Appears in the Dashboard and Client Portal sidebars.</p>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-xl">
                          🌿
                        </div>
                        <button className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg cursor-default">
                          Replace Logo
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Primary Color</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={e => { onPrimaryColorChange(e.target.value); triggerSave() }}
                          className="w-10 h-10 rounded-lg border border-gray-700 bg-gray-800 cursor-pointer p-0.5"
                        />
                        <span className="text-sm text-gray-400 font-mono">{primaryColor}</span>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">Applies to accent elements across the Dashboard and Client Portal.</p>
                    </div>
                  </div>
                </div>

                {/* Layout Theme */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h2 className="text-sm font-semibold text-white mb-1">Layout Theme</h2>
                  <p className="text-xs text-gray-500 mb-4">Applies to all staff in your organization.</p>
                  <div className="grid grid-cols-2 gap-3">
                    {LAYOUT_THEMES.map(({ id, label, desc, preview }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => { onLayoutThemeChange(id); triggerSave() }}
                        className="text-left p-3 rounded-lg border-2 transition-all"
                        style={{
                          borderColor: layoutTheme === id ? primaryColor : '#374151',
                          backgroundColor: layoutTheme === id ? primaryColor + '12' : 'rgba(31,41,55,0.5)',
                        }}
                      >
                        <div className="bg-gray-800 rounded p-2 mb-2.5">{preview}</div>
                        <p className="text-sm font-medium mb-0.5" style={{ color: layoutTheme === id ? primaryColor : 'white' }}>
                          {label}
                        </p>
                        <p className="text-[11px] text-gray-500 leading-tight">{desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* App Theme */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h2 className="text-sm font-semibold text-white mb-1">App Theme</h2>
                  <p className="text-xs text-gray-500 mb-4">Controls typography and visual aesthetic across the Dashboard and Client Portal.</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        id: 'modern', label: 'Modern',
                        desc: 'Clean & functional. Sans-serif UI, compact cards, sharp numerics.',
                        preview: (
                          <div className="h-14 w-full flex flex-col gap-1.5 justify-center px-2">
                            <div className="h-2 bg-gray-600 rounded w-3/4" />
                            <div className="h-1.5 bg-gray-700/60 rounded w-1/2" />
                            <div className="h-1.5 bg-gray-700/40 rounded w-2/3" />
                          </div>
                        ),
                      },
                      {
                        id: 'luxury', label: 'Luxury',
                        desc: 'Refined & elegant. Cormorant display headings, generous whitespace.',
                        preview: (
                          <div className="h-14 w-full flex flex-col gap-2 justify-center px-2">
                            <div className="h-3 bg-gray-600 rounded w-2/3" style={{ borderRadius: '1px' }} />
                            <div className="h-1 bg-gray-700/40 rounded w-1/2" />
                            <div className="h-1 bg-gray-700/30 rounded w-3/4" />
                          </div>
                        ),
                      },
                    ].map(({ id, label, desc, preview }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => { onAppThemeChange(id); triggerSave() }}
                        className="text-left p-3 rounded-lg border-2 transition-all"
                        style={{
                          borderColor: appTheme === id ? primaryColor : '#374151',
                          backgroundColor: appTheme === id ? primaryColor + '12' : 'rgba(31,41,55,0.5)',
                        }}
                      >
                        <div className="bg-gray-800 rounded p-2 mb-2.5">{preview}</div>
                        <p className="text-sm font-medium mb-0.5" style={{ color: appTheme === id ? primaryColor : 'white' }}>{label}</p>
                        <p className="text-[11px] text-gray-500 leading-tight">{desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Widget Visibility */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h2 className="text-sm font-semibold text-white mb-1">Widget Visibility</h2>
                  <p className="text-xs text-gray-500 mb-4">Disabled widgets won't render for any user in your org.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {DEMO_WIDGETS.map(({ id, label }) => {
                      const enabled = !disabledWidgets.includes(id)
                      return (
                        <label key={id}
                          className="flex items-center justify-between gap-3 px-3 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
                        >
                          <span className="text-sm text-gray-200">{label}</span>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={enabled}
                            onClick={() => toggleWidget(id)}
                            className="relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors"
                            style={{ backgroundColor: enabled ? primaryColor : '#4B5563' }}
                          >
                            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-5' : 'translate-x-1'}`} />
                          </button>
                        </label>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 pt-12 border-t border-neutral-100 flex flex-col sm:flex-row items-start gap-8">
        <div className="flex-1">
          <h3 className="font-serif text-2xl text-neutral-900 mb-2">Ready to configure your practice?</h3>
          <p className="text-neutral-500 font-light">We'll set this up together. Your branded portal live in under 48 hours.</p>
        </div>
        <button
          onClick={onGoToPricing}
          className="flex-shrink-0 self-center bg-neutral-900 text-white text-sm font-medium px-6 py-3.5 rounded-xl hover:bg-neutral-800 transition-colors"
        >
          See Pricing →
        </button>
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// Main
// ═════════════════════════════════════════════════════════════════════════════

export default function Demo() {
  const [activePage, setActivePage]         = useState<PageId>('dashboard')
  const [toasts, setToasts]                 = useState<ToastItem[]>([])
  const [portalCheckedIn, setPortalCheckedIn] = useState(false)
  const [portalBookedAppt, setPortalBookedAppt] = useState<BookedAppt>(null)
  // Org-level settings — controlled from Admin Panel, reflected in Dashboard + Portal
  const [primaryColor, setPrimaryColor]     = useState('#7a5c3b')
  const [layoutTheme, setLayoutTheme]       = useState('modern')
  const [appTheme, setAppTheme]             = useState('luxury')

  function pushToast(message: string, tone: 'success' | 'info' = 'info') {
    setToasts(t => [...t, { id: Date.now() + Math.random(), message, tone }])
  }
  function dismissToast(id: number) {
    setToasts(t => t.filter(x => x.id !== id))
  }

  function handleSetActivePage(id: PageId) {
    setActivePage(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex font-sans text-neutral-900">
      <LuxurySidebar activePage={activePage} setActivePage={handleSetActivePage} />

      <main className="flex-1 min-w-0">
        <MobileTopbar activePage={activePage} setActivePage={handleSetActivePage} />

        {activePage === 'dashboard' && (
          <DashboardSection
            portalCheckedIn={portalCheckedIn}
            portalBookedAppt={portalBookedAppt}
            onGoToPortal={() => handleSetActivePage('portal')}
            primaryColor={primaryColor}
            layoutTheme={layoutTheme}
            appTheme={appTheme}
          />
        )}
        {activePage === 'portal' && (
          <ClientPortalSection
            portalCheckedIn={portalCheckedIn}
            onCheckIn={() => {
              setPortalCheckedIn(true)
              pushToast("You're checked in — the front desk has been notified.", 'success')
            }}
            portalBookedAppt={portalBookedAppt}
            onBookAppt={(appt) => {
              setPortalBookedAppt(appt)
              pushToast(`Booking confirmed — ${appt.service} today at ${appt.time}.`, 'success')
            }}
            onGoToDashboard={() => handleSetActivePage('dashboard')}
            primaryColor={primaryColor}
            appTheme={appTheme}
          />
        )}
        {activePage === 'interactive' && (
          <AdminPanelSection
            onGoToPricing={() => handleSetActivePage('pricing')}
            primaryColor={primaryColor}
            onPrimaryColorChange={setPrimaryColor}
            layoutTheme={layoutTheme}
            onLayoutThemeChange={setLayoutTheme}
            appTheme={appTheme}
            onAppThemeChange={setAppTheme}
          />
        )}
        {activePage === 'pricing' && <PricingSection />}
        {activePage === 'faq'     && <FAQSection />}
      </main>

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
