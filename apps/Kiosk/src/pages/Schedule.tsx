import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useOrg, useResetInactivity } from '../App'
import { generateSlots, formatTime, formatDate, getUpcomingDates, toLocalDateString } from '../lib/slots'

const STEPS = ['service', 'date', 'time', 'info']

export default function Schedule() {
  const navigate        = useNavigate()
  const org             = useOrg()
  const resetInactivity = useResetInactivity()
  const accent          = org?.primary_color || '#6366f1'

  const [step, setStep]         = useState('service')
  const [services, setServices] = useState([])
  const [service, setService]   = useState(null)
  const [dates]                 = useState(() => getUpcomingDates(14))
  const [date, setDate]         = useState('')
  const [slots, setSlots]       = useState([])
  const [slot, setSlot]         = useState(null)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [name, setName]         = useState('')
  const [phone, setPhone]       = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (!org) return
    supabase
      .from('services')
      .select('id, name, duration_minutes, price')
      .eq('org_id', org.id)
      .eq('is_active', true)
      .order('name')
      .then(({ data }) => setServices(data || []))
  }, [org])

  async function loadSlots(selectedDate, selectedService) {
    if (!org || !selectedDate || !selectedService) return
    setLoadingSlots(true)
    const [y, m, d] = selectedDate.split('-').map(Number)
    const startOfDay = new Date(y, m - 1, d, 0, 0, 0).toISOString()
    const endOfDay   = new Date(y, m - 1, d, 23, 59, 59).toISOString()

    const { data } = await supabase
      .from('appointments')
      .select('scheduled_at, service:services!service_id(duration_minutes)')
      .eq('org_id', org.id)
      .in('status', ['confirmed', 'arrived', 'with_provider'])
      .gte('scheduled_at', startOfDay)
      .lte('scheduled_at', endOfDay)

    const available = generateSlots(
      '09:00', '17:00',
      selectedService.duration_minutes || 60,
      data || [],
      new Date(y, m - 1, d)
    )
    setSlots(available)
    setLoadingSlots(false)
  }

  function pickService(svc) {
    resetInactivity()
    setService(svc)
    setStep('date')
  }

  function pickDate(d) {
    resetInactivity()
    setDate(d)
    setSlot(null)
    loadSlots(d, service)
    setStep('time')
  }

  function pickSlot(s) {
    resetInactivity()
    setSlot(s)
    setStep('info')
  }

  async function submit() {
    resetInactivity()
    if (!name.trim()) { setFormError('Please enter your name.'); return }
    if (!phone.trim()) { setFormError('Please enter your phone number.'); return }
    setFormError('')
    setSubmitting(true)

    try {
      // Upsert client record
      const cleanPhone = phone.trim()
      let clientId = null
      const { data: existing } = await supabase
        .from('clients')
        .select('id')
        .eq('org_id', org.id)
        .eq('phone', cleanPhone)
        .maybeSingle()

      if (existing) {
        clientId = existing.id
      } else {
        const { data: newClient, error: clientErr } = await supabase
          .from('clients')
          .insert({ org_id: org.id, name: name.trim(), phone: cleanPhone })
          .select('id')
          .single()
        if (clientErr) throw clientErr
        clientId = newClient.id
      }

      // Create confirmed appointment
      const { error: apptErr } = await supabase
        .from('appointments')
        .insert({
          org_id:       org.id,
          client_id:    clientId,
          service_id:   service.id,
          scheduled_at: slot.toISOString(),
          status:       'confirmed',
        })
      if (apptErr) throw apptErr

      navigate('/done', {
        state: {
          type:    'schedule',
          name:    name.trim(),
          service: service.name,
          date:    formatDate(toLocalDateString(slot)),
          time:    formatTime(slot),
        },
      })
    } catch (err) {
      setFormError(err.message || 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  function back() {
    resetInactivity()
    const idx = STEPS.indexOf(step)
    if (idx === 0) navigate('/')
    else setStep(STEPS[idx - 1])
  }

  return (
    <div className="min-h-screen bg-[#080f1d] flex flex-col" onPointerDown={resetInactivity}>
      {/* Back */}
      <button onClick={back} className="flex items-center gap-2 px-8 pt-8 text-gray-500 hover:text-gray-300 transition-colors no-select">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-lg">Back</span>
      </button>

      {/* Step indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {STEPS.map((s, i) => (
          <div key={s} className="h-1.5 w-10 rounded-full transition-all"
               style={{ backgroundColor: STEPS.indexOf(step) >= i ? accent : '#1f2937' }} />
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-10 pb-12 animate-fade-up">

        {/* Step: Service */}
        {step === 'service' && (
          <div className="w-full max-w-xl">
            <h2 className="text-4xl font-bold text-white mb-2">What service?</h2>
            <p className="text-gray-400 text-xl mb-8">Choose what you're coming in for.</p>
            <div className="flex flex-col gap-3">
              {services.map(s => (
                <button
                  key={s.id}
                  onClick={() => pickService(s)}
                  className="w-full text-left px-6 py-5 rounded-2xl border-2 border-gray-800 bg-gray-900/50 transition-all active:scale-[0.98] no-select"
                  onPointerEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.backgroundColor = accent + '15' }}
                  onPointerLeave={e => { e.currentTarget.style.borderColor = '#1f2937'; e.currentTarget.style.backgroundColor = 'rgba(17,24,39,0.5)' }}
                >
                  <p className="text-2xl font-semibold text-white">{s.name}</p>
                  <p className="text-gray-500 text-base mt-0.5">
                    {s.duration_minutes} min{s.price > 0 ? ` · $${Number(s.price).toFixed(0)}` : ''}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: Date */}
        {step === 'date' && (
          <div className="w-full max-w-xl">
            <h2 className="text-4xl font-bold text-white mb-2">Pick a date</h2>
            <p className="text-gray-400 text-xl mb-8">{service?.name} · {service?.duration_minutes} min</p>
            <div className="grid grid-cols-3 gap-3">
              {dates.map(d => {
                const [y, m, day] = d.split('-').map(Number)
                const dt = new Date(y, m - 1, day)
                const weekday = dt.toLocaleDateString('en-US', { weekday: 'short' })
                const monthDay = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                return (
                  <button
                    key={d}
                    onClick={() => pickDate(d)}
                    className="flex flex-col items-center py-5 rounded-2xl border-2 border-gray-800 bg-gray-900/50 transition-all active:scale-[0.96] no-select"
                    onPointerEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.backgroundColor = accent + '15' }}
                    onPointerLeave={e => { e.currentTarget.style.borderColor = '#1f2937'; e.currentTarget.style.backgroundColor = 'rgba(17,24,39,0.5)' }}
                  >
                    <p className="text-gray-400 text-sm font-medium">{weekday}</p>
                    <p className="text-white text-xl font-bold mt-0.5">{monthDay}</p>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step: Time */}
        {step === 'time' && (
          <div className="w-full max-w-xl">
            <h2 className="text-4xl font-bold text-white mb-2">Pick a time</h2>
            <p className="text-gray-400 text-xl mb-8">{formatDate(date)}</p>
            {loadingSlots ? (
              <div className="flex justify-center py-12">
                <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
                     style={{ borderColor: accent, borderTopColor: 'transparent' }} />
              </div>
            ) : slots.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-xl">No available times on this day.</p>
                <button onClick={() => setStep('date')} className="mt-4 text-lg no-select" style={{ color: accent }}>Choose a different date</button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {slots.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => pickSlot(s)}
                    className="py-5 rounded-2xl border-2 border-gray-800 bg-gray-900/50 text-white text-xl font-semibold transition-all active:scale-[0.96] no-select"
                    onPointerEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.backgroundColor = accent + '15' }}
                    onPointerLeave={e => { e.currentTarget.style.borderColor = '#1f2937'; e.currentTarget.style.backgroundColor = 'rgba(17,24,39,0.5)' }}
                  >
                    {formatTime(s)}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step: Contact info */}
        {step === 'info' && (
          <div className="w-full max-w-xl">
            <h2 className="text-4xl font-bold text-white mb-2">Almost done</h2>
            <p className="text-gray-400 text-xl mb-8">
              {service?.name} · {formatDate(toLocalDateString(slot))} at {formatTime(slot)}
            </p>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-lg font-semibold text-gray-300 mb-2">Your name</label>
                <input
                  type="text"
                  autoFocus
                  value={name}
                  onChange={e => { setName(e.target.value); resetInactivity() }}
                  placeholder="First and last name"
                  className="w-full bg-gray-900 border-2 border-gray-700 rounded-2xl px-6 py-5 text-white text-2xl placeholder-gray-600 focus:outline-none focus:border-gray-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-300 mb-2">Phone number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => { setPhone(e.target.value); resetInactivity() }}
                  placeholder="(555) 000-0000"
                  className="w-full bg-gray-900 border-2 border-gray-700 rounded-2xl px-6 py-5 text-white text-2xl placeholder-gray-600 focus:outline-none focus:border-gray-500 transition-colors"
                />
              </div>
              {formError && <p className="text-red-400 text-base">{formError}</p>}
              <button
                onClick={submit}
                disabled={submitting || !name.trim() || !phone.trim()}
                className="w-full py-5 rounded-2xl text-2xl font-bold transition-all disabled:opacity-40 active:scale-[0.98] no-select mt-2"
                style={{ backgroundColor: accent, color: '#fff' }}
              >
                {submitting ? 'Booking...' : 'Confirm Appointment'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
