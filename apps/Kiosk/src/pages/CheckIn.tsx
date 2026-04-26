import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useOrg, useResetInactivity } from '../App'

function NumKey({ label, sub, onClick, accent }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center h-24 rounded-2xl border-2 border-gray-800 bg-gray-900 active:scale-[0.94] transition-all no-select text-white"
      onPointerEnter={e => { e.currentTarget.style.borderColor = accent + '60'; e.currentTarget.style.backgroundColor = accent + '15' }}
      onPointerLeave={e => { e.currentTarget.style.borderColor = '#1f2937'; e.currentTarget.style.backgroundColor = '#111827' }}
    >
      <span className="text-3xl font-bold">{label}</span>
      {sub && <span className="text-[10px] text-gray-500 tracking-widest mt-0.5">{sub}</span>}
    </button>
  )
}

const KEYPAD = [
  { label: '1', sub: '' },  { label: '2', sub: 'ABC' }, { label: '3', sub: 'DEF' },
  { label: '4', sub: 'GHI' },{ label: '5', sub: 'JKL' },{ label: '6', sub: 'MNO' },
  { label: '7', sub: 'PQRS' },{ label: '8', sub: 'TUV' },{ label: '9', sub: 'WXYZ' },
  { label: null },           { label: '0', sub: '' },   { label: '⌫', sub: '' },
]

export default function CheckIn() {
  const navigate        = useNavigate()
  const org             = useOrg()
  const resetInactivity = useResetInactivity()
  const accent          = org?.primary_color || '#6366f1'

  const [digits, setDigits]     = useState('')
  const [matches, setMatches]   = useState(null) // null = not searched yet
  const [searching, setSearching] = useState(false)
  const [error, setError]       = useState('')

  function pressKey(k) {
    resetInactivity()
    if (k === '⌫') {
      setDigits(d => d.slice(0, -1))
      setMatches(null)
      setError('')
      return
    }
    if (digits.length >= 4) return
    const next = digits + k
    setDigits(next)
    if (next.length === 4) search(next)
  }

  async function search(last4) {
    if (!org) return
    setSearching(true)
    setError('')
    setMatches(null)
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const { data, error: err } = await supabase
        .from('appointments')
        .select('id, scheduled_at, status, service:services!service_id(name), client:clients!client_id(id, name, phone)')
        .eq('org_id', org.id)
        .eq('status', 'confirmed')
        .gte('scheduled_at', today.toISOString())
        .lt('scheduled_at', tomorrow.toISOString())
        .order('scheduled_at')

      if (err) throw err

      // Filter by last 4 digits of phone (strip non-digits first)
      const found = (data || []).filter(a => {
        const digits = (a.client?.phone || '').replace(/\D/g, '')
        return digits.slice(-4) === last4
      })

      setMatches(found)
      if (found.length === 0) setError('No appointments found for those digits. Try again or ask the front desk.')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSearching(false)
    }
  }

  async function confirmCheckIn(appt) {
    resetInactivity()
    const { error } = await supabase
      .from('appointments')
      .update({ status: 'arrived' })
      .eq('id', appt.id)

    if (error) {
      alert('Check-in failed. Please see the front desk.')
      return
    }
    navigate('/done', {
      state: {
        type: 'checkin',
        name: appt.client?.name,
        service: appt.service?.name,
        time: new Date(appt.scheduled_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      },
    })
  }

  function reset() {
    setDigits('')
    setMatches(null)
    setError('')
  }

  return (
    <div className="min-h-screen bg-[#080f1d] flex flex-col" onPointerDown={resetInactivity}>
      {/* Back */}
      <button onClick={() => navigate('/')} className="flex items-center gap-2 px-8 pt-8 text-gray-500 hover:text-gray-300 transition-colors no-select">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-lg">Back</span>
      </button>

      <div className="flex-1 flex flex-col items-center justify-center px-10 pb-12">

        {/* Appointment list — after search */}
        {matches !== null && matches.length > 0 ? (
          <div className="w-full max-w-xl animate-fade-up">
            <h2 className="text-4xl font-bold text-white mb-2">We found you!</h2>
            <p className="text-gray-400 text-xl mb-8">Tap your name to check in.</p>
            <div className="flex flex-col gap-4">
              {matches.map(a => {
                const t = new Date(a.scheduled_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
                return (
                  <button
                    key={a.id}
                    onClick={() => confirmCheckIn(a)}
                    className="w-full text-left px-7 py-6 rounded-2xl border-2 transition-all active:scale-[0.98] no-select"
                    style={{ borderColor: accent + '50', backgroundColor: accent + '10' }}
                    onPointerEnter={e => { e.currentTarget.style.backgroundColor = accent + '22'; e.currentTarget.style.borderColor = accent }}
                    onPointerLeave={e => { e.currentTarget.style.backgroundColor = accent + '10'; e.currentTarget.style.borderColor = accent + '50' }}
                  >
                    <p className="text-3xl font-bold text-white">{a.client?.name}</p>
                    <p className="text-lg text-gray-400 mt-1">{a.service?.name} · {t}</p>
                  </button>
                )
              })}
            </div>
            <button onClick={reset} className="mt-8 text-lg text-gray-600 hover:text-gray-400 transition-colors no-select">
              Try different digits
            </button>
          </div>
        ) : (
          /* Keypad */
          <div className="w-full max-w-sm animate-fade-up">
            <h2 className="text-4xl font-bold text-white mb-2 text-center">Enter your last 4</h2>
            <p className="text-gray-400 text-xl mb-8 text-center">Last 4 digits of your phone number</p>

            {/* Digit display */}
            <div className="flex justify-center gap-4 mb-8">
              {[0, 1, 2, 3].map(i => (
                <div
                  key={i}
                  className="w-16 h-16 rounded-xl border-2 flex items-center justify-center text-3xl font-bold text-white transition-all"
                  style={{ borderColor: i < digits.length ? accent : '#374151', backgroundColor: i < digits.length ? accent + '18' : 'transparent' }}
                >
                  {digits[i] ? '•' : ''}
                </div>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                <p className="text-red-400 text-base">{error}</p>
                <button onClick={reset} className="text-sm text-gray-500 mt-1 hover:text-gray-300 no-select">Try again</button>
              </div>
            )}

            {/* Searching indicator */}
            {searching && (
              <div className="flex justify-center mb-6">
                <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
                     style={{ borderColor: accent, borderTopColor: 'transparent' }} />
              </div>
            )}

            {/* Numpad */}
            <div className="grid grid-cols-3 gap-3">
              {KEYPAD.map((k, i) =>
                k.label === null ? (
                  <div key={i} />
                ) : (
                  <NumKey
                    key={i}
                    label={k.label}
                    sub={k.sub}
                    accent={accent}
                    onClick={() => pressKey(k.label)}
                  />
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
