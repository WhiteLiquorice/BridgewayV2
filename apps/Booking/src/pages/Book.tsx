import { useEffect, useState, useRef } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { assign, createMachine } from 'xstate'
import { useMachine } from '@xstate/react'
import { supabase } from '../lib/supabase'
import { fns, storage } from '../lib/firebase'
import { httpsCallable } from 'firebase/functions'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import StripePayment from '../components/StripePayment'
import { generateSlots } from '@bridgeway/scheduling'

const STEPS_NO_PAY = ['Service', 'Date', 'Time', 'Your Info', 'Confirm']
const STEPS_PAY = ['Service', 'Date', 'Time', 'Your Info', 'Payment', 'Confirm']

function StepIndicator({ currentStep, steps }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((label, i) => {
        const step = i + 1
        const isActive = step === currentStep
        const isComplete = step < currentStep
        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  isComplete
                    ? 'bg-amber-500 text-[#080f1d]'
                    : isActive
                    ? 'bg-amber-500/20 text-amber-500 border border-amber-500/50'
                    : 'bg-gray-800 text-gray-500 border border-gray-700'
                }`}
              >
                {isComplete ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step
                )}
              </div>
              <span className={`text-xs hidden sm:block ${isActive ? 'text-amber-500' : 'text-gray-500'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-8 sm:w-12 h-px mb-5 ${isComplete ? 'bg-amber-500/50' : 'bg-gray-700'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function formatTime(date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}




// ─── xstate machine ───────────────────────────────────────────────────────────

const bookingMachine = createMachine({
  id: 'booking',
  initial: 'idle',
  context: {
    service: null,
    date: null,
    time: null,
    details: { name: '', email: '', phone: '', notes: '' },
    paymentRequired: false,
    bookingId: null,
    errorMessage: null,
  },
  states: {
    idle: {
      on: {
        SELECT_SERVICE: {
          target: 'serviceSelected',
          actions: assign({ service: ({ event }) => event.service }),
        },
      },
    },
    serviceSelected: {
      on: {
        SELECT_DATE: {
          target: 'dateSelected',
          actions: assign({ date: ({ event }) => event.date }),
        },
        BACK: { target: 'idle' },
      },
    },
    dateSelected: {
      on: {
        SELECT_TIME: {
          target: 'timeSelected',
          actions: assign({ time: ({ event }) => event.time }),
        },
        BACK: { target: 'serviceSelected' },
      },
    },
    timeSelected: {
      on: {
        ENTER_DETAILS: {
          target: 'detailsEntered',
          actions: assign({
            details: ({ event }) => event.details,
            paymentRequired: ({ event }) => event.paymentRequired,
          }),
        },
        BACK: { target: 'dateSelected' },
      },
    },
    // detailsEntered is a transient state — immediately transitions based on payment
    detailsEntered: {
      always: [
        {
          guard: ({ context }) => !!context.paymentRequired && Number(context.service?.price ?? 0) > 0,
          target: 'paying',
        },
        { target: 'confirming' },
      ],
    },
    paying: {
      on: {
        PAYMENT_COMPLETE: {
          target: 'confirming',
          actions: assign({ bookingId: ({ event }) => event.paymentIntentId }),
        },
        BACK: { target: 'timeSelected' },
      },
    },
    confirming: {
      on: {
        CONFIRM: 'confirmed',
        ERROR: {
          target: 'error',
          actions: assign({ errorMessage: ({ event }) => event.message }),
        },
      },
    },
    confirmed: {
      type: 'final',
    },
    error: {
      on: {
        RETRY: { target: 'confirming', actions: assign({ errorMessage: null }) },
      },
    },
  },
})

// Map machine state → wizard step number
function getStepNumber(stateName, needsPayment) {
  const map = needsPayment
    ? { idle: 1, serviceSelected: 2, dateSelected: 3, timeSelected: 4, detailsEntered: 5, paying: 5, confirming: 6, confirmed: 6, error: 6 }
    : { idle: 1, serviceSelected: 2, dateSelected: 3, timeSelected: 4, detailsEntered: 5, confirming: 5, confirmed: 5, error: 5 }
  return map[stateName] ?? 1
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Book() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const orgSlug = slug || searchParams.get('org')

  const [state, send] = useMachine(bookingMachine)
  const { service, date, time, details } = state.context

  // Org / services loading — stays as regular useEffect (xstate manages wizard, not data)
  const [org, setOrg] = useState(null)
  const [services, setServices] = useState([])
  const [loadingInit, setLoadingInit] = useState(true)
  const [orgError, setOrgError] = useState(null)
  const [paymentRequired, setPaymentRequired] = useState(false)
  const [externalSyncEnabled, setExternalSyncEnabled] = useState(false)

  // Date step helpers
  const [existingBookings, setExistingBookings] = useState([])
  const [loadingDate, setLoadingDate] = useState(false)
  const [availableSlots, setAvailableSlots] = useState([])

  // Details form local state (validated before sending to machine)
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' })
  const [referenceImage, setReferenceImage] = useState<File | null>(null)
  const [formErrors, setFormErrors] = useState({})

  // Submit state
  const [submitting, setSubmitting] = useState(false)
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [successBooking, setSuccessBooking] = useState(null)

  // Progressive registration state
  const [accountMode, setAccountMode] = useState('prompt') // 'prompt' | 'create' | 'signin' | 'guest'
  const [accountPassword, setAccountPassword] = useState('')
  const [accountError, setAccountError] = useState('')
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState(false)

  // Check if already logged in — skip account prompt if so
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setAlreadyLoggedIn(true)
        setAccountMode('guest')
      }
    })
  }, [])

  useEffect(() => {
    async function init() {
      if (!orgSlug) {
        setOrgError('No organization specified.')
        setLoadingInit(false)
        return
      }

      // If returning from Stripe success, fetch the booking data
      if (searchParams.get('payment_success') === 'true' && searchParams.get('bookingId')) {
        const { data: bookingData } = await supabase
          .from('bookings')
          .select('*, services(*)')
          .eq('id', searchParams.get('bookingId'))
          .single()
        
        if (bookingData) {
          setSuccessBooking(bookingData)
        }
      }

      const orgRes = await supabase
        .from('orgs')
        .select('*')
        .eq('slug', orgSlug)
        .eq('subscription_tier', 'base')
        .maybeSingle()

      if (orgRes.error || !orgRes.data) {
        setOrgError('Organization not found.')
        setLoadingInit(false)
        return
      }

      const loadedOrg = orgRes.data

      const { data: orgServices } = await supabase
        .from('services')
        .select('*')
        .eq('org_id', loadedOrg.id)
        .eq('is_archived', false)
        .order('name')

      setOrg(loadedOrg)
      setServices(orgServices || [])

      const { data: orgSettings } = await supabase
        .from('org_settings')
        .select('payment_required, external_calendar_sync_enabled, stripe_account_id')
        .eq('org_id', loadedOrg.id)
        .maybeSingle()
        
      if (orgSettings?.payment_required) {
        setPaymentRequired(true)
      }
      if (orgSettings?.external_calendar_sync_enabled) {
        setExternalSyncEnabled(true)
      }
      loadedOrg.stripe_account_id = orgSettings?.stripe_account_id

      setLoadingInit(false)
    }
    init()
  }, [orgSlug])

  async function handleDateChange(selectedDate) {
    send({ type: 'SELECT_DATE', date: selectedDate })
    setAvailableSlots([])
    if (!selectedDate || !org) return

    setLoadingDate(true)
    const [year, month, day] = selectedDate.split('-').map(Number)
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0).toISOString()
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59).toISOString()

    const { data } = await supabase
      .from('appointments')
      .select('scheduled_at, services(duration_minutes)')
      .eq('org_id', org.id)
      .in('status', ['confirmed', 'pending'])
      .gte('scheduled_at', startOfDay)
      .lte('scheduled_at', endOfDay)

    setExistingBookings(data || [])
    setLoadingDate(false)
  }

  useEffect(() => {
    if (!date || !service || !org) {
      setAvailableSlots([])
      return
    }
    const slots = generateSlots(
      '09:00',
      '17:00',
      service.duration_minutes || 60,
      existingBookings,
      [], // Placeholder for external events from Google Calendar
      date,
      2,
      { smartGapEnabled: true, minGapMinutes: 30, slotInterval: 15 }
    )
    setAvailableSlots(slots)
  }, [date, service, existingBookings, org])

  function validateForm() {
    const errors = {}
    if (!form.name.trim()) errors.name = 'Full name is required'
    if (!form.email.trim()) errors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Invalid email address'
    if (!form.phone.trim()) errors.phone = 'Phone number is required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit() {
    // Handle optional account creation / sign-in before booking
    if (accountMode === 'create') {
      if (!accountPassword) {
        setAccountError('Please enter a password.')
        return
      }
      setAccountError('')
      const { error } = await supabase.auth.signUp({
        email: details.email,
        password: accountPassword,
        options: {
          data: { full_name: details.name, role: 'patient', org_id: org.id },
        },
      })
      if (error) {
        setAccountError(error.message)
        return
      }
    } else if (accountMode === 'signin') {
      if (!accountPassword) {
        setAccountError('Please enter your password.')
        return
      }
      setAccountError('')
      const { error } = await supabase.auth.signInWithPassword({
        email: details.email,
        password: accountPassword,
      })
      if (error) {
        setAccountError(error.message)
        return
      }
    }

    setSubmitting(true)

    let finalNotes = details.notes || null
    if (referenceImage) {
      try {
        const ext = referenceImage.name.split('.').pop()
        const storageRef = ref(storage, `booking_references/${org.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`)
        await uploadBytes(storageRef, referenceImage)
        const downloadUrl = await getDownloadURL(storageRef)
        finalNotes = finalNotes ? `${finalNotes}\n\nReference Image: ${downloadUrl}` : `Reference Image: ${downloadUrl}`
      } catch (err) {
        console.error('Failed to upload reference image:', err)
      }
    }

    const bookingPayload = {
      org_id: org.id,
      service_id: service.id,
      name: details.name,
      email: details.email,
      phone: details.phone,
      preferred_date: date,
      preferred_time: time.toTimeString().slice(0, 5),
      notes: finalNotes,
      status: 'pending',
    }
    if (paymentCompleted) {
      bookingPayload.payment_status = 'paid'
    }
    const { data, error } = await supabase.from('bookings').insert(bookingPayload).select().single()

    if (error) {
      setSubmitting(false)
      send({ type: 'ERROR', message: error.message })
    } else {
      // If Stripe Connect payment is required, redirect to checkout
      if (needsPayment && org?.stripe_account_id && !paymentCompleted) {
        try {
          const createBookingHoldSession = httpsCallable(functions, 'createBookingHoldSession')
          const result = await createBookingHoldSession({
            stripeAccountId: org.stripe_account_id,
            amount: Number(service.price) * 100, // Convert to cents
            currency: 'usd',
            successUrl: `${window.location.origin}${window.location.pathname}?org=${org.slug}&payment_success=true&bookingId=${data.id}`,
            cancelUrl: window.location.href,
            bookingDetails: { bookingId: data.id }
          })
          window.location.href = result.data.url
          return
        } catch (err) {
          console.error('Failed to create stripe checkout session:', err)
          setSubmitting(false)
          send({ type: 'ERROR', message: 'Failed to initiate payment. Please try again.' })
          return
        }
      }

      setSubmitting(false)
      send({ type: 'CONFIRM' })
      supabase.functions.invoke('notify-new-booking', { body: { booking_id: data.id } })
        .catch(() => { /* notification failure is non-fatal */ })
    }
  }

  function resetBooking() {
    window.location.reload()
  }

  const needsPayment = paymentRequired && service && Number(service.price) > 0
  const steps = needsPayment ? STEPS_PAY : STEPS_NO_PAY
  const currentStepNum = getStepNumber(state.value, needsPayment)

  const minDateObj = new Date(Date.now() + 2 * 60 * 60 * 1000)
  const minDate = minDateObj.toISOString().split('T')[0]

  // ── Early-exit screens ──────────────────────────────────────────────────────

  if (!orgSlug) {
    return (
      <div className="min-h-screen bg-[#0c1a2e] flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No Organization Specified</h2>
          <p className="text-gray-400 text-sm">
            Please use a booking link that includes an organization. For example:
          </p>
          <code className="inline-block mt-3 px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-amber-400 text-xs font-mono">
            /book?org=your-org-slug
          </code>
        </div>
      </div>
    )
  }

  if (loadingInit) {
    return (
      <div className="min-h-screen bg-[#0c1a2e] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (orgError) {
    return (
      <div className="min-h-screen bg-[#0c1a2e] flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Organization Not Found</h2>
          <p className="text-gray-400 text-sm">{orgError}</p>
        </div>
      </div>
    )
  }

  // Success screen
  if (state.matches('confirmed') || successBooking) {
    const displayService = service || successBooking?.services
    let displayDate = 'TBD'
    let displayTime = 'TBD'
    
    if (date) {
      displayDate = formatDate(date)
      displayTime = time ? formatTime(time) : 'TBD'
    } else if (successBooking?.scheduled_at) {
      const d = new Date(successBooking.scheduled_at)
      displayDate = d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      displayTime = formatTime(d)
    }

    const displayName = details.name || successBooking?.customer_name
    const displayEmail = details.email || successBooking?.customer_email

    return (
      <div className="min-h-screen bg-[#0c1a2e] flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Booking Received!</h2>
          <p className="text-gray-400 mb-8">We'll confirm your appointment shortly.</p>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-left space-y-3 mb-8">
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Service</span>
              <span className="text-white text-sm font-medium">{displayService?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Date</span>
              <span className="text-white text-sm font-medium">{displayDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Time</span>
              <span className="text-white text-sm font-medium">{displayTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Duration</span>
              <span className="text-white text-sm font-medium">{displayService?.duration_minutes} min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Name</span>
              <span className="text-white text-sm font-medium">{displayName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Email</span>
              <span className="text-white text-sm font-medium">{displayEmail}</span>
            </div>
          </div>

          <button
            onClick={resetBooking}
            className="bg-amber-500 hover:bg-amber-400 text-[#080f1d] font-semibold rounded-lg px-6 py-2.5 text-sm transition-colors"
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    )
  }

  // ── Main wizard shell ───────────────────────────────────────────────────────

  const brandColor = org?.primary_color || '#f59e0b'

  return (
    <div className="min-h-screen bg-[#0c1a2e]">
      {/* Inject brand color as CSS custom property for white-labeling */}
      <style>{`:root { --brand-color: ${brandColor}; }`}</style>

      {/* Header */}
      <div className="bg-[#080f1d] border-b border-gray-800 px-4 py-6 text-center">
        {org?.logo_url && (
          <img src={org.logo_url} alt="" className="w-10 h-10 rounded-lg object-cover mx-auto mb-3" />
        )}
        <h1 className="text-2xl font-bold text-white">
          {org?.name || 'Book an Appointment'}
        </h1>
        {org?.description && (
          <p className="text-gray-400 text-sm mt-1 max-w-md mx-auto">{org.description}</p>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <StepIndicator currentStep={currentStepNum} steps={steps} />

        {/* Step 1: Select Service */}
        {state.matches('idle') && (
          <div>
            <h2 className="text-white text-xl font-semibold mb-1">Select a Service</h2>
            <p className="text-gray-400 text-sm mb-6">Choose the service you'd like to book</p>

            {services.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No services available at this time.</div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {services.map(svc => (
                  <button
                    key={svc.id}
                    onClick={() => send({ type: 'SELECT_SERVICE', service: svc })}
                    className="text-left p-5 rounded-xl border-2 border-gray-700 bg-gray-900 hover:border-gray-600 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm">{svc.name}</p>
                        <p className="text-gray-400 text-xs mt-1">{svc.duration_minutes} min</p>
                      </div>
                      <span className="text-sm font-bold shrink-0 text-white">
                        ${Number(svc.price).toFixed(2)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select Date */}
        {state.matches('serviceSelected') && (
          <div>
            <h2 className="text-white text-xl font-semibold mb-1">Select a Date</h2>
            <p className="text-gray-400 text-sm mb-6">Choose your preferred date</p>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">Date</label>
              <input
                type="date"
                min={minDate}
                value={date || ''}
                onChange={e => handleDateChange(e.target.value)}
                className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors"
              />

              {loadingDate && (
                <div className="mt-3 flex items-center gap-2 text-gray-400 text-sm">
                  <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  Checking availability…
                </div>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => send({ type: 'BACK' })}
                className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Select Time */}
        {state.matches('dateSelected') && (
          <div>
            <h2 className="text-white text-xl font-semibold mb-1">Select a Time</h2>
            <p className="text-gray-400 text-sm mb-4">
              Available slots for {formatDate(date)}
            </p>

            {/* Smart scheduling info banner */}
            {availableSlots.some(s => s.recommended) && (
              <div className="flex items-start gap-2.5 mb-5 px-4 py-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="text-xs text-amber-400/80">
                  <span className="font-semibold text-amber-400">Smart scheduling</span> — Highlighted times maximize calendar efficiency and minimize scheduling gaps.
                </p>
              </div>
            )}

            {availableSlots.length === 0 ? (
              <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-xl">
                <p className="text-gray-400 text-sm">No available slots for this date.</p>
                <p className="text-gray-500 text-xs mt-1">Please select a different date.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableSlots.map((slot, i) => {
                  const isSelected = time?.getTime() === slot.time.getTime();
                  return (
                    <button
                      key={i}
                      onClick={() => send({ type: 'SELECT_TIME', time: slot.time })}
                      className={`relative flex flex-col items-center justify-center py-3 px-2 rounded-xl border-2 transition-all overflow-hidden ${
                        isSelected
                          ? 'bg-amber-500 border-amber-500 text-[#080f1d] shadow-lg shadow-amber-500/20'
                          : slot.recommended
                          ? 'bg-gray-800/80 border-amber-500/50 hover:border-amber-500 text-white hover:shadow-md hover:shadow-amber-500/10'
                          : 'bg-gray-900 border-gray-800 hover:border-gray-600 text-gray-400'
                      }`}
                    >
                      {slot.recommended && !isSelected && (
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500/30 via-amber-500/60 to-amber-500/30" />
                      )}
                      <span className={`text-base font-bold ${isSelected ? 'text-[#080f1d]' : 'text-white'}`}>
                        {formatTime(slot.time)}
                      </span>
                      {slot.recommended && (
                        <span className={`text-[10px] uppercase tracking-wider font-semibold mt-1 ${isSelected ? 'text-[#080f1d]/70' : 'text-amber-500'}`}>
                          {slot.recommendReason || 'Best match'}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}

            <div className="flex justify-between mt-6">
              <button
                onClick={() => send({ type: 'BACK' })}
                className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Your Information */}
        {state.matches('timeSelected') && (
          <div>
            <h2 className="text-white text-xl font-semibold mb-1">Your Information</h2>
            <p className="text-gray-400 text-sm mb-6">We'll use this to confirm your booking</p>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Jane Smith"
                  className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors"
                />
                {formErrors.name && <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="jane@example.com"
                  className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors"
                />
                {formErrors.email && <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  Phone <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="(555) 000-0000"
                  className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors"
                />
                {formErrors.phone && <p className="text-red-400 text-xs mt-1">{formErrors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  Notes <span className="text-gray-600 font-normal">(optional)</span>
                </label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Any additional information or requests…"
                  rows={3}
                  className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                  Reference Image <span className="text-gray-600 font-normal">(optional)</span>
                </label>
                <div className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setReferenceImage(e.target.files[0])
                      }
                    }}
                    className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-500/10 file:text-amber-500 hover:file:bg-amber-500/20 cursor-pointer"
                  />
                  {referenceImage && <p className="text-amber-400 text-xs mt-2 truncate">Selected: {referenceImage.name}</p>}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => send({ type: 'BACK' })}
                className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => {
                  if (validateForm()) {
                    send({
                      type: 'ENTER_DETAILS',
                      details: { ...form },
                      paymentRequired,
                    })
                  }
                }}
                className="bg-amber-500 hover:bg-amber-400 text-[#080f1d] font-semibold rounded-lg px-6 py-2.5 text-sm transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Payment (conditional) */}
        {state.matches('paying') && (
          <div>
            <h2 className="text-white text-xl font-semibold mb-1">Payment</h2>
            <p className="text-gray-400 text-sm mb-6">Secure payment via Stripe</p>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              {org?.stripe_account_id ? (
                <div className="text-center py-6">
                  <p className="text-white mb-4">You will be redirected to Stripe to securely enter your payment details.</p>
                  <button
                    onClick={() => {
                      // Proceed to confirm step which will trigger the redirect in handleSubmit
                      send({ type: 'PAYMENT_COMPLETE', paymentIntentId: 'pending_checkout' })
                    }}
                    className="bg-[#635BFF] hover:bg-[#5851df] text-white font-semibold rounded-lg px-6 py-2.5 text-sm transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-amber-500 mb-4">Payment is required but this business has not connected a Stripe account.</p>
                  <button
                    onClick={() => send({ type: 'PAYMENT_COMPLETE', paymentIntentId: 'skipped_no_stripe' })}
                    className="bg-amber-500 hover:bg-amber-400 text-[#080f1d] font-semibold rounded-lg px-6 py-2.5 text-sm transition-colors"
                  >
                    Skip Payment (Test Mode)
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => send({ type: 'BACK' })}
                className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* Confirm / Error step */}
        {(state.matches('confirming') || state.matches('error')) && (
          <div>
            <h2 className="text-white text-xl font-semibold mb-1">Review & Confirm</h2>
            <p className="text-gray-400 text-sm mb-6">Please review your appointment details</p>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4 mb-6">
              <div className="pb-4 border-b border-gray-800">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Appointment</p>
                <div className="space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Service</span>
                    <span className="text-white text-sm font-medium">{service?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Date</span>
                    <span className="text-white text-sm font-medium">{formatDate(date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Time</span>
                    <span className="text-white text-sm font-medium">{time && formatTime(time)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Duration</span>
                    <span className="text-white text-sm font-medium">{service?.duration_minutes} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Price</span>
                    <span className="text-amber-500 text-sm font-bold">${Number(service?.price).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Your Information</p>
                <div className="space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Name</span>
                    <span className="text-white text-sm font-medium">{details.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Email</span>
                    <span className="text-white text-sm font-medium">{details.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Phone</span>
                    <span className="text-white text-sm font-medium">{details.phone}</span>
                  </div>
                  {details.notes && (
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-400 text-sm shrink-0">Notes</span>
                      <span className="text-white text-sm font-medium text-right">{details.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Progressive registration */}
            {alreadyLoggedIn ? (
              <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-5 py-3.5">
                <p className="text-emerald-400 text-xs">Booking will be linked to your account.</p>
              </div>
            ) : (
              <div className="mb-6 bg-gray-900 border border-gray-800 rounded-xl p-5">
                {accountMode === 'prompt' && (
                  <>
                    <p className="text-white text-sm font-semibold mb-1">Save this booking to your account</p>
                    <p className="text-gray-400 text-xs mb-4">Create an account to manage and view your bookings anytime — or continue as a guest.</p>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setAccountMode('create')}
                        className="flex-1 bg-amber-500 hover:bg-amber-400 text-[#080f1d] font-semibold rounded-lg px-4 py-2 text-sm transition-colors"
                      >
                        Create Account
                      </button>
                      <button
                        type="button"
                        onClick={() => setAccountMode('signin')}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-white rounded-lg px-4 py-2 text-sm transition-colors border border-gray-700"
                      >
                        Sign In
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAccountMode('guest')}
                      className="mt-3 text-gray-500 hover:text-gray-400 text-xs transition-colors block"
                    >
                      Continue as guest →
                    </button>
                  </>
                )}

                {(accountMode === 'create' || accountMode === 'signin') && (
                  <>
                    <p className="text-white text-sm font-semibold mb-3">
                      {accountMode === 'create' ? 'Create your account' : 'Sign in to your account'}
                    </p>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Email</label>
                        <input
                          type="email"
                          value={details.email}
                          readOnly
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-gray-400 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Password</label>
                        <input
                          type="password"
                          value={accountPassword}
                          onChange={e => { setAccountPassword(e.target.value); setAccountError('') }}
                          placeholder={accountMode === 'create' ? 'Choose a password (min. 6 characters)' : 'Enter your password'}
                          className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors"
                        />
                      </div>
                      {accountError && (
                        <p className="text-red-400 text-xs">{accountError}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => { setAccountMode('prompt'); setAccountPassword(''); setAccountError('') }}
                      className="mt-3 text-gray-500 hover:text-gray-400 text-xs transition-colors"
                    >
                      ← Back to options
                    </button>
                  </>
                )}

                {accountMode === 'guest' && (
                  <div className="flex items-center justify-between">
                    <p className="text-gray-400 text-xs">Continuing as guest — no account will be created.</p>
                    <button
                      type="button"
                      onClick={() => setAccountMode('prompt')}
                      className="text-gray-500 hover:text-gray-400 text-xs transition-colors ml-4 shrink-0"
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>
            )}

            {state.matches('error') && state.context.errorMessage && (
              <div className="mb-4 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3.5 py-2.5">
                {state.context.errorMessage}
              </div>
            )}

            <div className="flex justify-between">
              {state.matches('error') ? (
                <button
                  onClick={() => send({ type: 'RETRY' })}
                  className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
                >
                  Try Again
                </button>
              ) : (
                <div />
              )}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-[#080f1d] font-semibold rounded-lg px-6 py-2.5 text-sm transition-colors flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#080f1d] border-t-transparent rounded-full animate-spin" />
                    Booking…
                  </>
                ) : accountMode === 'create' ? (
                  'Book & Create Account'
                ) : accountMode === 'signin' ? (
                  'Sign In & Book'
                ) : (
                  'Book Appointment'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
