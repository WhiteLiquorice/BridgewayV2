import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { createPortal } from 'react-dom'

const PAGES = [
  { label: 'Dashboard',    path: '/overview',     icon: '⊞' },
  { label: 'Appointments',  path: '/appointments', icon: '📅' },
  { label: 'Clients',       path: '/clients',      icon: '👤' },
  { label: 'Revenue',       path: '/revenue',      icon: '💰' },
  { label: 'Availability',  path: '/availability', icon: '🕐' },
  { label: 'Checkout',      path: '/checkout',     icon: '🛒' },
  { label: 'Settings',      path: '/settings',     icon: '⚙' },
]

export default function CommandPalette({ isOpen, onClose, onNewAppointment, onNewClient }) {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [clients, setClients] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  // Preview data: { phone, nextAppt: { date, service } | null, apptCount } keyed by client id
  const [clientPreviews, setClientPreviews] = useState({})
  const inputRef = useRef(null)
  const searchTimer = useRef(null)
  const previewTimer = useRef(null)

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setClients([])
      setClientPreviews({})
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Debounced client search — include phone in select
  useEffect(() => {
    if (!profile?.org_id) return
    clearTimeout(searchTimer.current)
    if (!query.trim()) { setClients([]); setClientPreviews({}); return }
    searchTimer.current = setTimeout(async () => {
      const { data } = await supabase
        .from('clients')
        .select('id, name, email, phone')
        .eq('org_id', profile.org_id)
        .ilike('name', `%${query}%`)
        .limit(5)
      setClients(data || [])
    }, 200)
    return () => clearTimeout(searchTimer.current)
  }, [query, profile?.org_id])

  // Build results list
  const q = query.toLowerCase()
  const filteredPages = PAGES.filter(p => p.label.toLowerCase().includes(q))
  const actions = [
    { label: 'New Appointment', action: () => { onClose(); onNewAppointment?.() }, icon: '+' },
    { label: 'New Client', action: () => { onClose(); onNewClient?.() }, icon: '+' },
  ].filter(a => !q || a.label.toLowerCase().includes(q))

  const allResults = [
    ...filteredPages.map(p => ({ type: 'page', ...p })),
    ...clients.map(c => ({ type: 'client', label: c.name, sublabel: c.email, id: c.id, phone: c.phone })),
    ...actions.map(a => ({ type: 'action', ...a })),
  ]

  // Fetch preview for the highlighted client (debounced)
  useEffect(() => {
    clearTimeout(previewTimer.current)
    const item = allResults[selectedIndex]
    if (!item || item.type !== 'client') return
    const clientId = item.id
    if (clientPreviews[clientId] !== undefined) return // already fetched

    previewTimer.current = setTimeout(async () => {
      const now = new Date().toISOString()
      const { data: appts } = await supabase
        .from('appointments')
        .select('id, scheduled_at, service:services!service_id(name)')
        .eq('org_id', profile.org_id)
        .eq('client_id', clientId)
        .gte('scheduled_at', now)
        .in('status', ['confirmed', 'arrived'])
        .order('scheduled_at')
        .limit(1)

      const { count } = await supabase
        .from('appointments')
        .select('id', { count: 'exact', head: true })
        .eq('org_id', profile.org_id)
        .eq('client_id', clientId)

      setClientPreviews(prev => ({
        ...prev,
        [clientId]: {
          apptCount: count || 0,
          nextAppt: appts?.[0] || null,
        },
      }))
    }, 150)

    return () => clearTimeout(previewTimer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex, allResults.length])

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [allResults.length])

  const handleSelect = useCallback((item) => {
    onClose()
    if (item.type === 'page') navigate(item.path)
    else if (item.type === 'client') navigate(`/clients/${item.id}`)
    else if (item.type === 'action') item.action()
  }, [navigate, onClose])

  function handleKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => Math.min(i + 1, allResults.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && allResults[selectedIndex]) {
      e.preventDefault()
      handleSelect(allResults[selectedIndex])
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4 bg-black/60"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
          <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search clients, pages, or actions..."
            className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-gray-500 bg-gray-800 rounded border border-gray-700">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {allResults.length === 0 && query && (
            <p className="px-4 py-6 text-sm text-gray-500 text-center">No results found</p>
          )}

          {filteredPages.length > 0 && (
            <div className="px-3 pt-1 pb-1">
              <p className="text-[10px] font-medium text-gray-600 uppercase tracking-wider px-1 mb-1">Navigate</p>
              {filteredPages.map((page) => {
                const idx = allResults.findIndex(r => r.type === 'page' && r.path === page.path)
                return (
                  <button
                    key={page.path}
                    onClick={() => handleSelect(allResults[idx])}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      idx === selectedIndex ? 'bg-brand/10 text-brand' : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-base w-5 text-center">{page.icon}</span>
                    <span>{page.label}</span>
                  </button>
                )
              })}
            </div>
          )}

          {clients.length > 0 && (
            <div className="px-3 pt-1 pb-1">
              <p className="text-[10px] font-medium text-gray-600 uppercase tracking-wider px-1 mb-1">Clients</p>
              {clients.map(c => {
                const idx = allResults.findIndex(r => r.type === 'client' && r.id === c.id)
                const isSelected = idx === selectedIndex
                const preview = clientPreviews[c.id]
                return (
                  <div key={c.id}>
                    <button
                      onClick={() => handleSelect(allResults[idx])}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isSelected ? 'bg-brand/10 text-brand' : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <span className="text-base w-5 text-center">👤</span>
                      <span className="font-medium">{c.name}</span>
                      {c.email && <span className="text-xs text-gray-500 ml-auto truncate max-w-[140px]">{c.email}</span>}
                    </button>

                    {/* Inline preview card — shown when this client is keyboard-focused */}
                    {isSelected && (
                      <div className="mx-3 mb-1 px-3 py-2.5 bg-gray-800/60 border border-gray-700/60 rounded-lg">
                        {preview ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-4 text-xs">
                              {c.phone && (
                                <span className="flex items-center gap-1.5 text-gray-400">
                                  <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                  </svg>
                                  {c.phone}
                                </span>
                              )}
                              <span className="flex items-center gap-1.5 text-gray-400">
                                <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {preview.apptCount} total appt{preview.apptCount !== 1 ? 's' : ''}
                              </span>
                            </div>
                            {preview.nextAppt ? (
                              <div className="flex items-center gap-1.5 text-xs text-brand/80">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Next:{' '}
                                {new Date(preview.nextAppt.scheduled_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                {' @ '}
                                {new Date(preview.nextAppt.scheduled_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                {preview.nextAppt.service?.name && ` · ${preview.nextAppt.service.name}`}
                              </div>
                            ) : (
                              <div className="text-xs text-gray-600">No upcoming appointments</div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <div className="w-3 h-3 border border-gray-600 border-t-transparent rounded-full animate-spin" />
                            Loading...
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {actions.length > 0 && (
            <div className="px-3 pt-1 pb-1">
              <p className="text-[10px] font-medium text-gray-600 uppercase tracking-wider px-1 mb-1">Actions</p>
              {actions.map((a) => {
                const idx = allResults.findIndex(r => r.type === 'action' && r.label === a.label)
                return (
                  <button
                    key={a.label}
                    onClick={() => handleSelect(allResults[idx])}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      idx === selectedIndex ? 'bg-brand/10 text-brand' : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-base w-5 text-center font-bold text-brand">{a.icon}</span>
                    <span>{a.label}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
