import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { dataconnect } from '../../lib/firebase'
import { getAvailableSlotsForBooking, getActiveServices, getOrgById, getOrgSettings, getActiveClassesForBooking, getExistingRegistration, getClassRegistrationsCount, createClassRegistration, createBooking } from '@bridgeway/database'
import StripePayment from '../../components/StripePayment'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function fmtSlot(slot) {
  const start = new Date(slot.start_time)
  const end   = new Date(slot.end_time)
  const date  = start.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  const s     = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  const e     = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  return `${date} · ${s} – ${e}`
}

// Wraps each step with a fade-in animation
function StepPanel({ children, stepKey }) {
  return (
    <div key={stepKey} className="step-enter">
      {children}
    </div>
  )
}

// Progress dots
function StepIndicator({ total, current }) {
  return (
    <div className="flex items-center gap-2 mb-10">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-0.5 flex-1 rounded-full transition-colors duration-300 ${
            i < current ? 'bg-neutral-800' : 'bg-neutral-200'
          }`}
        />
      ))}
    </div>
  )
}

export default function BookAppointment() {
  const { profile, user, clientId } = useAuth()
  const { primaryColor } = useTheme()

  // Flow type: 'appointment' | 'class'
  const [flowType, setFlowType] = useState(null)

  // Appointment booking
  const [step, setStep] = useState(0)  // 0=type 1=service 2=time 3=confirm
  const [slots,       setSlots]       = useState([])
  const [services,    setServices]    = useState([])
  const [loadingData, setLoadingData] = useState(true)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedSlot,    setSelectedSlot]    = useState(null)
  const [notes,       setNotes]       = useState('')
  const [submitting,  setSubmitting]  = useState(false)
  const [error,       setError]       = useState(null)
  const [submitted,   setSubmitted]   = useState(false)

  // Class registration
  const [classes,        setClasses]        = useState([])
  const [loadingClasses, setLoadingClasses] = useState(true)
  const [selectedClass,  setSelectedClass]  = useState(null)
  const [classDate,      setClassDate]      = useState('')
  const [classStep,      setClassStep]      = useState(0) // 0=pick class 1=pick date 2=confirm
  const [classSubmitting, setClassSubmitting] = useState(false)
  const [classError,     setClassError]     = useState(null)
  const [classSubmitted, setClassSubmitted] = useState(false)

  // Payment
  const [orgData,         setOrgData]         = useState(null)
  const [paymentRequired, setPaymentRequired] = useState(false)
  const [showPayment,     setShowPayment]     = useState(false)
  const [paymentDone,     setPaymentDone]     = useState(false)

  useEffect(() => {
    if (!profile?.org_id) return
    async function loadData() {
      setLoadingData(true)
      try {
        const [slotsRes, svcRes, orgRes, settingsRes] = await Promise.all([
          getAvailableSlotsForBooking(dataconnect, { orgId: profile.org_id, now: new Date().toISOString() }),
          getActiveServices(dataconnect, { orgId: profile.org_id }),
          getOrgById(dataconnect, { id: profile.org_id }),
          getOrgSettings(dataconnect, { orgId: profile.org_id })
        ])
        
        const mappedSlots = (slotsRes.data.slots || []).map((s: any) => ({
          ...s,
          start_time: s.startTime,
          end_time: s.endTime,
          staff_id: s.staff?.id || null,
          profiles: s.staff ? { full_name: s.staff.fullName } : null
        }))
        
        const mappedServices = (svcRes.data.services || []).map((s: any) => ({
          ...s,
          duration_minutes: s.durationMinutes
        }))

        setSlots(mappedSlots as any)
        setServices(mappedServices as any)

        const orgInfo = orgRes.data.org
        if (orgInfo) {
          setOrgData({
            ...orgInfo,
            stripe_publishable_key: orgInfo.stripePublishableKey
          } as any)
          
          const settings = settingsRes.data.orgSettings[0]
          if (settings?.paymentRequired) {
            setPaymentRequired(true)
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingData(false)
      }
    }
    loadData()
  }, [profile?.org_id])

  useEffect(() => {
    if (!profile?.org_id) return
    async function loadClasses() {
      setLoadingClasses(true)
      try {
        const res = await getActiveClassesForBooking(dataconnect, { orgId: profile.org_id })
        const mapped = (res.data.classes || []).map((c: any) => ({
          ...c,
          day_of_week: c.dayOfWeek,
          start_time: c.startTime,
          duration_minutes: c.durationMinutes,
          instructor: c.instructor ? { full_name: c.instructor.fullName } : null
        }))
        setClasses(mapped as any)
      } catch { /* ignore */ } finally {
        setLoadingClasses(false)
      }
    }
    loadClasses()
  }, [profile?.org_id])

  async function handleSubmitAppointment() {
    if (!selectedSlot || !selectedService || !profile?.org_id) return
    if (paymentRequired && Number(selectedService.price) > 0 && !paymentDone) {
      setShowPayment(true)
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      await createBooking(dataconnect, {
        orgId: profile.org_id,
        serviceId: selectedService.id,
        slotId: selectedSlot.id,
        name: profile.full_name || '',
        email: profile.email || user?.email || '',
        phone: profile.phone || null,
        notes: notes.trim() || null,
        status: 'pending',
        paymentStatus: paymentDone ? 'paid' : null,
        preferredDate: null,
        preferredTime: null
      })
      setSlots((prev: any) => prev.filter((s: any) => s.id !== selectedSlot.id))
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Failed to submit — check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSubmitClass() {
    if (!selectedClass || !classDate || !clientId || !profile?.org_id) return
    setClassError(null)
    setClassSubmitting(true)
    try {
      const regRes = await getExistingRegistration(dataconnect, {
        classId: selectedClass.id,
        clientId: clientId,
        classDate: classDate
      })
      const existing = regRes.data.classRegistrations[0]
      if (existing) { setClassError('You are already registered for this class on this date.'); return }

      const countRes = await getClassRegistrationsCount(dataconnect, {
        classId: selectedClass.id,
        classDate: classDate
      })
      const count = countRes.data.classRegistrations.length
      const status = count >= (selectedClass.capacity || 10) ? 'waitlisted' : 'registered'

      await createClassRegistration(dataconnect, {
        orgId: profile.org_id,
        classId: selectedClass.id,
        clientId: clientId,
        classDate: classDate,
        status,
      })
      setClassSubmitted(true)
    } catch (err: any) {
      setClassError(err.message || 'Failed to register — check your connection and try again.')
    } finally {
      setClassSubmitting(false)
    }
  }

  const getNextDates = (cls) => {
    if (!cls) return []
    const dates = []
    const today = new Date()
    const d = new Date(today)
    for (let i = 0; i < 28 && dates.length < 4; i++) {
      if (d.getDay() === cls.day_of_week && d >= today) {
        dates.push(d.toISOString().split('T')[0])
      }
      d.setDate(d.getDate() + 1)
    }
    return dates
  }

  // ── Prompt shared between flows ────────────────────────────────────────────
  const sectionLabel = 'text-xs font-medium text-neutral-400 uppercase tracking-widest mb-6'
  const cardBase = 'bg-white rounded-2xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all'
  const cardHover = 'hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] hover:border-neutral-200 cursor-pointer'
  const btnPrimary = 'w-full rounded-xl py-4 font-medium text-white text-sm tracking-wide transition-opacity hover:opacity-90 disabled:opacity-40'

  // ── Success screens ────────────────────────────────────────────────────────
  if (submitted) return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-6">
          <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-serif text-3xl text-neutral-900 mb-3">Request Received</h2>
        <p className="text-sm text-neutral-500 leading-relaxed">
          Your appointment request has been received. We'll reach out to confirm your time shortly.
        </p>
        <button
          onClick={() => { setSubmitted(false); setSelectedService(null); setSelectedSlot(null); setNotes(''); setStep(0); setFlowType(null) }}
          className="mt-8 text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          Book another appointment
        </button>
      </div>
    </div>
  )

  if (classSubmitted) return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-6">
          <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-serif text-3xl text-neutral-900 mb-3">You're Registered</h2>
        <p className="text-sm text-neutral-500 leading-relaxed">
          You've been registered for <strong className="text-neutral-700">{selectedClass?.name}</strong>. Check your appointments for details.
        </p>
        <button
          onClick={() => { setClassSubmitted(false); setSelectedClass(null); setClassDate(''); setClassStep(0); setFlowType(null) }}
          className="mt-8 text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          Register for another class
        </button>
      </div>
    </div>
  )

  return (
    <div>
      {/* Heading */}
      <div className="mb-12">
        <h1 className="font-serif text-5xl tracking-tight text-neutral-900">Make a Reservation</h1>
        <p className="text-sm text-neutral-400 mt-2">We look forward to seeing you.</p>
      </div>

      {/* ── Step 0: Choose appointment or class ─────────────────────────── */}
      {flowType === null && (
        <StepPanel stepKey="type">
          <p className={sectionLabel}>What can we help you with?</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => { setFlowType('appointment'); setStep(1) }}
              className={`${cardBase} ${cardHover} p-8 text-left`}
            >
              <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center mb-5">
                <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <p className="font-serif text-xl text-neutral-900 mb-1">Appointment</p>
              <p className="text-xs text-neutral-400">One-on-one service with a specialist</p>
            </button>
            {classes.length > 0 && (
              <button
                onClick={() => { setFlowType('class'); setClassStep(1) }}
                className={`${cardBase} ${cardHover} p-8 text-left`}
              >
                <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center mb-5">
                  <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
                  </svg>
                </div>
                <p className="font-serif text-xl text-neutral-900 mb-1">Class</p>
                <p className="text-xs text-neutral-400">Join a scheduled group session</p>
              </button>
            )}
          </div>
        </StepPanel>
      )}

      {/* ── Appointment flow ─────────────────────────────────────────────── */}
      {flowType === 'appointment' && (
        <>
          <StepIndicator total={3} current={step} />

          {/* Step 1: Service */}
          {step === 1 && (
            <StepPanel stepKey="appt-service">
              <p className={sectionLabel}>What service interests you?</p>
              {loadingData ? (
                <div className="flex justify-center py-12">
                  <div className="w-5 h-5 border-2 border-neutral-200 border-t-neutral-500 rounded-full animate-spin" />
                </div>
              ) : services.length === 0 ? (
                <p className="text-sm text-neutral-400 py-8 text-center">No services available at this time.</p>
              ) : (
                <div className="space-y-3">
                  {services.map(svc => (
                    <button
                      key={svc.id}
                      onClick={() => { setSelectedService(svc); setStep(2) }}
                      className={`${cardBase} ${cardHover} w-full p-7 flex items-center justify-between`}
                    >
                      <div className="text-left">
                        <p className="font-serif text-xl text-neutral-900">{svc.name}</p>
                        {svc.description && (
                          <p className="text-xs text-neutral-400 mt-1">{svc.description}</p>
                        )}
                        {svc.duration_minutes && (
                          <p className="text-xs text-neutral-400 mt-1">{svc.duration_minutes} min</p>
                        )}
                      </div>
                      {svc.price > 0 && (
                        <span className="font-serif text-xl text-neutral-700 ml-6 flex-shrink-0">
                          ${Number(svc.price).toFixed(0)}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
              <button onClick={() => { setFlowType(null) }} className="mt-8 text-xs text-neutral-400 hover:text-neutral-600 transition-colors">
                ← Back
              </button>
            </StepPanel>
          )}

          {/* Step 2: Time slot */}
          {step === 2 && selectedService && (
            <StepPanel stepKey="appt-slot">
              <p className={sectionLabel}>When would you like to come in?</p>
              <div className="mb-6 flex items-center justify-between">
                <span className="font-serif text-xl text-neutral-700">{selectedService.name}</span>
                <button onClick={() => setStep(1)} className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors">Change</button>
              </div>
              {slots.length === 0 ? (
                <div className={`${cardBase} p-10 text-center`}>
                  <p className="text-sm text-neutral-500">No available times right now.</p>
                  <p className="text-xs text-neutral-400 mt-1">Please call us to schedule directly.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {slots.map(slot => (
                    <button
                      key={slot.id}
                      onClick={() => { setSelectedSlot(slot); setStep(3) }}
                      className={`${cardBase} ${cardHover} w-full px-7 py-5 flex items-center justify-between`}
                    >
                      <div className="text-left">
                        <p className="text-sm font-medium text-neutral-800">{fmtSlot(slot)}</p>
                        {slot.profiles?.full_name && (
                          <p className="text-xs text-neutral-400 mt-0.5">with {slot.profiles.full_name}</p>
                        )}
                      </div>
                      <svg className="w-4 h-4 text-neutral-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
              )}
              <button onClick={() => setStep(1)} className="mt-8 text-xs text-neutral-400 hover:text-neutral-600 transition-colors">
                ← Back
              </button>
            </StepPanel>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && selectedService && selectedSlot && (
            <StepPanel stepKey="appt-confirm">
              <p className={sectionLabel}>Confirm your reservation</p>

              {/* Summary card */}
              <div className={`${cardBase} p-8 mb-6`}>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="font-serif text-2xl text-neutral-900">{selectedService.name}</p>
                    <p className="text-sm text-neutral-500 mt-1">{fmtSlot(selectedSlot)}</p>
                    {selectedSlot.profiles?.full_name && (
                      <p className="text-xs text-neutral-400 mt-0.5">with {selectedSlot.profiles.full_name}</p>
                    )}
                  </div>
                  {selectedService.price > 0 && (
                    <span className="font-serif text-2xl text-neutral-700">${Number(selectedService.price).toFixed(0)}</span>
                  )}
                </div>
                <div className="border-t border-neutral-100 pt-5">
                  <p className="text-xs text-neutral-400 mb-2">On file for this booking</p>
                  <p className="text-sm text-neutral-700">{profile?.full_name}</p>
                  <p className="text-xs text-neutral-400">{profile?.email || user?.email}</p>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-xs font-medium text-neutral-400 uppercase tracking-widest mb-3">
                  Anything we should know? <span className="normal-case tracking-normal">(optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Special requests or notes for your provider…"
                  className="w-full bg-white border border-neutral-200 rounded-xl px-5 py-4 text-sm text-neutral-800 placeholder-neutral-300 focus:outline-none focus:ring-2 focus:border-transparent resize-none"
                  style={{ '--tw-ring-color': `${primaryColor}40` }}
                />
              </div>

              {/* Payment step */}
              {showPayment && orgData && (
                <div className="mb-6 border border-neutral-200 rounded-xl p-5">
                  <StripePayment
                    orgId={orgData.id}
                    stripePublishableKey={orgData.stripe_publishable_key}
                    amount={Number(selectedService.price || 0)}
                    onSuccess={() => { setPaymentDone(true); setShowPayment(false) }}
                    onError={() => {}}
                  />
                </div>
              )}

              {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

              <button
                onClick={handleSubmitAppointment}
                disabled={submitting}
                className={btnPrimary}
                style={{ backgroundColor: primaryColor }}
              >
                {submitting ? 'Confirming…' : paymentDone ? 'Confirm Reservation (Paid)' : 'Confirm Reservation'}
              </button>

              <button onClick={() => { setStep(2); setError(null) }} className="w-full mt-3 text-xs text-neutral-400 hover:text-neutral-600 transition-colors text-center">
                ← Change time
              </button>
            </StepPanel>
          )}
        </>
      )}

      {/* ── Class flow ───────────────────────────────────────────────────── */}
      {flowType === 'class' && (
        <>
          <StepIndicator total={2} current={classStep} />

          {/* Step 1: Pick class */}
          {classStep === 1 && (
            <StepPanel stepKey="class-pick">
              <p className={sectionLabel}>Which class would you like to join?</p>
              {loadingClasses ? (
                <div className="flex justify-center py-12">
                  <div className="w-5 h-5 border-2 border-neutral-200 border-t-neutral-500 rounded-full animate-spin" />
                </div>
              ) : classes.length === 0 ? (
                <p className="text-sm text-neutral-400 py-8 text-center">No classes available at this time.</p>
              ) : (
                <div className="space-y-3">
                  {classes.map(cls => (
                    <button
                      key={cls.id}
                      onClick={() => { setSelectedClass(cls); setClassDate(''); setClassStep(2) }}
                      className={`${cardBase} ${cardHover} w-full p-7 text-left`}
                    >
                      <p className="font-serif text-xl text-neutral-900">{cls.name}</p>
                      <div className="flex flex-wrap gap-3 mt-2">
                        <span className="text-xs text-neutral-400">{DAYS[cls.day_of_week]}s at {cls.start_time?.slice(0, 5)}</span>
                        {cls.duration_minutes && <span className="text-xs text-neutral-400">· {cls.duration_minutes} min</span>}
                        {cls.instructor?.full_name && <span className="text-xs text-neutral-400">· {cls.instructor.full_name}</span>}
                        {cls.location && <span className="text-xs text-neutral-400">· {cls.location}</span>}
                      </div>
                      {cls.description && (
                        <p className="text-xs text-neutral-400 mt-2 leading-relaxed">{cls.description}</p>
                      )}
                    </button>
                  ))}
                </div>
              )}
              <button onClick={() => { setFlowType(null) }} className="mt-8 text-xs text-neutral-400 hover:text-neutral-600 transition-colors">
                ← Back
              </button>
            </StepPanel>
          )}

          {/* Step 2: Pick date + confirm */}
          {classStep === 2 && selectedClass && (
            <StepPanel stepKey="class-date">
              <p className={sectionLabel}>When would you like to attend?</p>
              <div className="mb-6 flex items-center justify-between">
                <span className="font-serif text-xl text-neutral-700">{selectedClass.name}</span>
                <button onClick={() => setClassStep(1)} className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors">Change</button>
              </div>

              {(() => {
                const nextDates = getNextDates(selectedClass)
                return nextDates.length === 0 ? (
                  <p className="text-sm text-neutral-400 py-8 text-center">No upcoming dates available.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {nextDates.map(d => (
                      <button
                        key={d}
                        onClick={() => setClassDate(d)}
                        className={`${cardBase} px-5 py-4 text-sm font-medium transition-all ${
                          classDate === d
                            ? 'border-neutral-300 shadow-[0_8px_30px_rgb(0,0,0,0.06)]'
                            : `${cardHover}`
                        }`}
                        style={classDate === d ? { borderColor: `${primaryColor}60`, color: primaryColor } : {}}
                      >
                        {new Date(d + 'T00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </button>
                    ))}
                  </div>
                )
              })()}

              {classError && <p className="text-sm text-red-500 mb-4">{classError}</p>}

              <button
                onClick={handleSubmitClass}
                disabled={classSubmitting || !classDate}
                className={btnPrimary}
                style={{ backgroundColor: primaryColor }}
              >
                {classSubmitting ? 'Registering…' : 'Register for Class'}
              </button>

              <button onClick={() => setClassStep(1)} className="w-full mt-3 text-xs text-neutral-400 hover:text-neutral-600 transition-colors text-center">
                ← Back
              </button>
            </StepPanel>
          )}
        </>
      )}
    </div>
  )
}
