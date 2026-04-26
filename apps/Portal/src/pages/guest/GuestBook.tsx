import { useState, useEffect, useMemo } from 'react'
import { useGuestOrg } from '../../context/GuestOrgContext'
import { supabase } from '../../lib/supabase'

// ── Shared style tokens ────────────────────────────────────────────────────────
const card     = 'bg-white rounded-2xl border border-neutral-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)] transition-all'
const cardBtn  = `${card} hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-neutral-200 cursor-pointer`
const label    = 'text-xs font-medium text-neutral-400 uppercase tracking-widest'
const inputCls = 'w-full bg-white border border-neutral-200 rounded-xl px-5 py-3.5 text-sm text-neutral-800 placeholder-neutral-300 focus:outline-none focus:ring-2 focus:border-transparent'

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}
function fmtDate(dateStr) {
  return new Date(dateStr + 'T00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })
}
function initials(name = '') {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

// ── Step progress bar ─────────────────────────────────────────────────────────
function StepBar({ total, current, primary }) {
  return (
    <div className="flex items-center gap-1.5 mb-10">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-0.5 flex-1 rounded-full transition-all duration-500 bg-neutral-100"
          style={i < current ? { backgroundColor: primary } : {}}
        />
      ))}
    </div>
  )
}

// ── Toggle switch ─────────────────────────────────────────────────────────────
function BackBtn({ onClick }) {
  return (
    <button onClick={onClick} className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors">
      ← Back
    </button>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function GuestBook() {
  const { org, loading: orgLoading, error: orgError } = useGuestOrg()
  const primary = org?.primary_color   || '#203536'  // header bg, step bar completed
  const accent  = org?.secondary_color || '#c9a84c'  // buttons, selections, avatars

  // Booking config (from org_settings.booking_config)
  const [config, setConfig] = useState({
    show_providers:     true,
    require_phone:      false,
    welcome_text:       '',
    confirmation_text:  '',
  })

  // Raw data
  const [services,     setServices]     = useState([])
  const [slots,        setSlots]        = useState([])
  const [dataLoading,  setDataLoading]  = useState(true)

  // Selections
  const [step,             setStep]             = useState(0)
  const [selectedService,  setSelectedService]  = useState(null)
  const [selectedProvider, setSelectedProvider] = useState(null) // null = no preference
  const [selectedDate,     setSelectedDate]     = useState(null)
  const [selectedSlot,     setSelectedSlot]     = useState(null)

  // Guest info
  const [guestName,  setGuestName]  = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [guestNotes, setGuestNotes] = useState('')

  // Submit
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [submitted,  setSubmitted]  = useState(false)

  // ── Load data ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!org?.id) return
    setDataLoading(true)
    Promise.all([
      supabase.from('services')
        .select('id, name, duration_minutes, price, description')
        .eq('org_id', org.id)
        .eq('is_archived', false)
        .order('name'),
      supabase.from('slots')
        .select('id, start_time, end_time, staff_id, profiles(id, full_name)')
        .eq('org_id', org.id)
        .eq('status', 'available')
        .gte('start_time', new Date().toISOString())
        .order('start_time')
        .limit(300),
      supabase.from('org_settings')
        .select('booking_config')
        .eq('org_id', org.id)
        .maybeSingle(),
    ]).then(([{ data: svcs }, { data: sl }, { data: settings }]) => {
      setServices(svcs || [])
      setSlots(sl || [])
      if (settings?.booking_config) {
        setConfig(prev => ({ ...prev, ...settings.booking_config }))
      }
      setDataLoading(false)
    })
  }, [org?.id])

  // ── Derived data ─────────────────────────────────────────────────────────────
  const providers = useMemo(() => {
    const map = new Map()
    slots.forEach(s => {
      if (s.profiles?.id && !map.has(s.profiles.id)) {
        map.set(s.profiles.id, s.profiles)
      }
    })
    return [...map.values()]
  }, [slots])

  const availableDates = useMemo(() => {
    const filtered = selectedProvider
      ? slots.filter(s => s.staff_id === selectedProvider.id)
      : slots
    const dates = [...new Set(filtered.map(s => s.start_time.slice(0, 10)))]
    return dates.sort().slice(0, 30)
  }, [slots, selectedProvider])

  const slotsForDate = useMemo(() => {
    if (!selectedDate) return []
    return slots
      .filter(s =>
        s.start_time.startsWith(selectedDate) &&
        (!selectedProvider || s.staff_id === selectedProvider.id)
      )
      .sort((a, b) => a.start_time.localeCompare(b.start_time))
  }, [slots, selectedDate, selectedProvider])

  // Step offsets depend on whether provider selection is shown
  const STEP = {
    SERVICE:   0,
    PROVIDER:  config.show_providers ? 1 : null,
    DATETIME:  config.show_providers ? 2 : 1,
    INFO:      config.show_providers ? 3 : 2,
    CONFIRM:   config.show_providers ? 4 : 3,
    TOTAL:     config.show_providers ? 5 : 4,
  }

  // ── Submit ───────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    if (!selectedSlot || !selectedService) return
    if (!guestName.trim() || !guestEmail.trim()) return
    if (config.require_phone && !guestPhone.trim()) return
    setSubmitError(null)
    setSubmitting(true)
    try {
      const { error: err } = await supabase.from('bookings').insert({
        org_id:     org.id,
        service_id: selectedService.id,
        slot_id:    selectedSlot.id,
        name:       guestName.trim(),
        email:      guestEmail.trim(),
        phone:      guestPhone.trim() || null,
        notes:      guestNotes.trim() || null,
        status:     'pending',
      })
      if (err) { setSubmitError(err.message); return }
      setSubmitted(true)
    } catch {
      setSubmitError('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function resetAll() {
    setStep(0); setSelectedService(null); setSelectedProvider(null)
    setSelectedDate(null); setSelectedSlot(null)
    setGuestName(''); setGuestEmail(''); setGuestPhone(''); setGuestNotes('')
    setSubmitted(false); setSubmitError(null)
  }

  // ── Loading / error states ────────────────────────────────────────────────────
  if (orgLoading) return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-neutral-200 border-t-neutral-600 rounded-full animate-spin" />
    </div>
  )

  if (orgError) return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-6">
      <p className="text-sm text-neutral-400 text-center">{orgError}</p>
    </div>
  )

  // ── Success screen ────────────────────────────────────────────────────────────
  if (submitted) return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
      <div className={`${card} max-w-md w-full p-12 text-center`}>
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-6">
          <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-serif text-3xl text-neutral-900 mb-3">You're all set</h2>
        <p className="text-sm text-neutral-500 leading-relaxed max-w-xs mx-auto">
          {config.confirmation_text || "Your request has been received. We'll be in touch shortly to confirm your appointment."}
        </p>
        <button onClick={resetAll} className="mt-8 text-xs text-neutral-400 hover:text-neutral-600 transition-colors">
          Book another appointment
        </button>
      </div>
    </div>
  )

  // ── Main layout ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-neutral-50">

      {/* Header */}
      <div className="sticky top-0 z-10" style={{ backgroundColor: primary }}>
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          {org?.logo_url && (
            <img src={org.logo_url} alt={org.name} className="h-7 w-auto object-contain flex-shrink-0" />
          )}
          <span className="font-serif text-base text-white">{org?.name}</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* Welcome text (step 0 only) */}
        {step === STEP.SERVICE && config.welcome_text && (
          <p className="text-sm text-neutral-500 mb-8 leading-relaxed">{config.welcome_text}</p>
        )}

        <StepBar total={STEP.TOTAL} current={step} primary={primary} />

        {/* ── STEP 0: Service ───────────────────────────────────────────────── */}
        {step === STEP.SERVICE && (
          <div>
            <p className={`${label} mb-6`}>What service are you looking for?</p>
            {dataLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-6 h-6 border-2 border-neutral-200 border-t-neutral-500 rounded-full animate-spin" />
              </div>
            ) : services.length === 0 ? (
              <p className="text-sm text-neutral-400 text-center py-12">No services available at this time.</p>
            ) : (
              <div className="space-y-3">
                {services.map(svc => (
                  <button
                    key={svc.id}
                    onClick={() => { setSelectedService(svc); setStep(config.show_providers ? STEP.PROVIDER : STEP.DATETIME) }}
                    className={`${cardBtn} w-full p-7 flex items-start justify-between gap-6`}
                  >
                    <div className="text-left min-w-0">
                      <p className="font-serif text-xl text-neutral-900">{svc.name}</p>
                      {svc.description && (
                        <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{svc.description}</p>
                      )}
                      {svc.duration_minutes && (
                        <p className="text-xs text-neutral-400 mt-1">{svc.duration_minutes} min</p>
                      )}
                    </div>
                    {svc.price > 0 && (
                      <span className="font-serif text-xl flex-shrink-0" style={{ color: accent }}>
                        ${Number(svc.price).toFixed(0)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── STEP 1 (optional): Provider ──────────────────────────────────── */}
        {config.show_providers && step === STEP.PROVIDER && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className={`${label}`}>Choose your provider</p>
              <BackBtn onClick={() => setStep(STEP.SERVICE)} />
            </div>
            <div className="flex items-center justify-between mb-8 mt-1">
              <span className="font-serif text-xl text-neutral-700">{selectedService?.name}</span>
              <button onClick={() => setStep(STEP.SERVICE)} className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors">
                Change
              </button>
            </div>

            <div className="space-y-3">
              {/* No preference */}
              <button
                onClick={() => { setSelectedProvider(null); setStep(STEP.DATETIME) }}
                className={`${cardBtn} w-full p-6 flex items-center gap-4`}
              >
                <div className="w-11 h-11 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-neutral-800">No preference</p>
                  <p className="text-xs text-neutral-400 mt-0.5">Show all available times</p>
                </div>
              </button>

              {providers.map(p => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedProvider(p); setStep(STEP.DATETIME) }}
                  className={`${cardBtn} w-full p-6 flex items-center gap-4`}
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-semibold"
                    style={{ backgroundColor: primary }}
                  >
                    {initials(p.full_name)}
                  </div>
                  <p className="text-sm font-medium text-neutral-800">{p.full_name}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP: Date + Time ─────────────────────────────────────────────── */}
        {step === STEP.DATETIME && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className={`${label}`}>Pick a date and time</p>
              <BackBtn onClick={() => setStep(config.show_providers ? STEP.PROVIDER : STEP.SERVICE)} />
            </div>
            <div className="flex items-center justify-between mb-8 mt-1">
              <span className="font-serif text-xl text-neutral-700">{selectedService?.name}</span>
              {selectedProvider && (
                <span className="text-xs text-neutral-500">with {selectedProvider.full_name}</span>
              )}
            </div>

            {availableDates.length === 0 ? (
              <div className={`${card} p-10 text-center`}>
                <p className="text-sm text-neutral-500">No availability right now.</p>
                <p className="text-xs text-neutral-400 mt-1">Please contact us to schedule directly.</p>
              </div>
            ) : (
              <>
                {/* Date strip */}
                <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1 mb-8" style={{ scrollbarWidth: 'none' }}>
                  {availableDates.map(d => {
                    const active = selectedDate === d
                    return (
                      <button
                        key={d}
                        onClick={() => { setSelectedDate(d); setSelectedSlot(null) }}
                        className={`flex-shrink-0 px-3.5 py-2 rounded-xl border text-center transition-all ${
                          active
                            ? 'text-white border-transparent shadow-sm'
                            : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
                        }`}
                        style={active ? { backgroundColor: accent, borderColor: accent } : {}}
                      >
                        <span className={`block text-[10px] font-medium ${active ? 'opacity-80' : 'text-neutral-400'}`}>
                          {new Date(d + 'T00:00').toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                        <span className="block text-sm font-semibold mt-0.5">
                          {new Date(d + 'T00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* Time grid */}
                {!selectedDate ? (
                  <p className="text-sm text-neutral-400 text-center py-4">Select a date to see available times.</p>
                ) : slotsForDate.length === 0 ? (
                  <p className="text-sm text-neutral-400 text-center py-4">No times available on this date.</p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {slotsForDate.map(slot => {
                      const active = selectedSlot?.id === slot.id
                      return (
                        <button
                          key={slot.id}
                          onClick={() => {
                            setSelectedSlot(slot)
                            setStep(STEP.INFO)
                          }}
                          className={`rounded-xl border py-3 px-2 text-sm font-medium transition-all ${
                            active
                              ? 'text-white border-transparent'
                              : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                          }`}
                          style={active ? { backgroundColor: accent } : {}}
                        >
                          {fmtTime(slot.start_time)}
                          {slot.profiles?.full_name && !selectedProvider && (
                            <span className="block text-[10px] opacity-70 mt-0.5 truncate">
                              {slot.profiles.full_name.split(' ')[0]}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── STEP: Guest Info ─────────────────────────────────────────────── */}
        {step === STEP.INFO && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <p className={`${label}`}>Your information</p>
              <BackBtn onClick={() => setStep(STEP.DATETIME)} />
            </div>

            <div className="space-y-4">
              <div>
                <label className={`${label} block mb-1.5`}>Full Name</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  placeholder="Jane Smith"
                  className={inputCls}
                  style={{ '--tw-ring-color': `${accent}40` }}
                  autoComplete="name"
                />
              </div>

              <div>
                <label className={`${label} block mb-1.5`}>Email</label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={e => setGuestEmail(e.target.value)}
                  placeholder="jane@email.com"
                  className={inputCls}
                  style={{ '--tw-ring-color': `${accent}40` }}
                  autoComplete="email"
                />
              </div>

              <div>
                <label className={`${label} block mb-1.5`}>
                  Phone{' '}
                  {!config.require_phone && (
                    <span className="normal-case font-normal text-neutral-400">(optional)</span>
                  )}
                </label>
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={e => setGuestPhone(e.target.value)}
                  placeholder="(555) 000-0000"
                  className={inputCls}
                  style={{ '--tw-ring-color': `${accent}40` }}
                  autoComplete="tel"
                />
              </div>

              <div>
                <label className={`${label} block mb-1.5`}>
                  Notes{' '}
                  <span className="normal-case font-normal text-neutral-400">(optional)</span>
                </label>
                <textarea
                  value={guestNotes}
                  onChange={e => setGuestNotes(e.target.value)}
                  rows={3}
                  placeholder="Anything we should know before your visit…"
                  className={`${inputCls} resize-none`}
                  style={{ '--tw-ring-color': `${accent}40` }}
                />
              </div>
            </div>

            <button
              onClick={() => {
                if (!guestName.trim() || !guestEmail.trim()) return
                if (config.require_phone && !guestPhone.trim()) return
                setStep(STEP.CONFIRM)
              }}
              disabled={
                !guestName.trim() ||
                !guestEmail.trim() ||
                (config.require_phone && !guestPhone.trim())
              }
              className="mt-8 w-full rounded-xl py-4 font-medium text-white text-sm tracking-wide transition-opacity hover:opacity-90 disabled:opacity-40"
              style={{ backgroundColor: accent }}
            >
              Continue
            </button>
          </div>
        )}

        {/* ── STEP: Confirm ────────────────────────────────────────────────── */}
        {step === STEP.CONFIRM && selectedService && selectedSlot && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <p className={`${label}`}>Confirm your booking</p>
              <BackBtn onClick={() => setStep(STEP.INFO)} />
            </div>

            {/* Summary card */}
            <div className={`${card} p-8 mb-6`}>
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="font-serif text-2xl text-neutral-900">{selectedService.name}</p>
                  <p className="text-sm text-neutral-500 mt-1">
                    {fmtDate(selectedDate)} · {fmtTime(selectedSlot.start_time)}
                  </p>
                  {selectedSlot.profiles?.full_name && (
                    <p className="text-xs text-neutral-400 mt-0.5">with {selectedSlot.profiles.full_name}</p>
                  )}
                  {selectedService.duration_minutes && (
                    <p className="text-xs text-neutral-400 mt-0.5">{selectedService.duration_minutes} min</p>
                  )}
                </div>
                {selectedService.price > 0 && (
                  <span className="font-serif text-2xl flex-shrink-0" style={{ color: accent }}>
                    ${Number(selectedService.price).toFixed(0)}
                  </span>
                )}
              </div>

              <div className="border-t border-neutral-100 pt-5 space-y-1">
                <p className="text-sm text-neutral-800 font-medium">{guestName}</p>
                <p className="text-xs text-neutral-400">{guestEmail}</p>
                {guestPhone && <p className="text-xs text-neutral-400">{guestPhone}</p>}
                {guestNotes && (
                  <p className="text-xs text-neutral-400 mt-2 italic leading-relaxed">"{guestNotes}"</p>
                )}
              </div>
            </div>

            {submitError && (
              <p className="text-sm text-red-500 mb-4">{submitError}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full rounded-xl py-4 font-medium text-white text-sm tracking-wide transition-opacity hover:opacity-90 disabled:opacity-40"
              style={{ backgroundColor: accent }}
            >
              {submitting ? 'Confirming…' : 'Confirm Booking'}
            </button>

            <p className="text-xs text-neutral-400 text-center mt-4 leading-relaxed">
              We'll reach out to confirm your appointment.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
