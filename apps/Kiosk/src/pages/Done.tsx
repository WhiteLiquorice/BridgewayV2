import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useOrg } from '../App'

const AUTO_RESET_S = 10

export default function Done() {
  const navigate    = useNavigate()
  const location    = useLocation()
  const org         = useOrg()
  const accent      = org?.primary_color || '#6366f1'
  const state       = location.state || {}
  const [countdown, setCountdown] = useState(AUTO_RESET_S)

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { navigate('/'); return AUTO_RESET_S }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [navigate])

  const isWalkIn   = state.type === 'walkin'
  const isCheckIn  = state.type === 'checkin'
  const isSchedule = state.type === 'schedule'

  return (
    <div className="min-h-screen bg-[#080f1d] flex flex-col items-center justify-center px-10 py-12">
      {/* Check icon */}
      <div
        className="w-28 h-28 rounded-full flex items-center justify-center mb-8 animate-scale-in"
        style={{ backgroundColor: accent + '20', border: `3px solid ${accent}40` }}
      >
        <svg className="w-14 h-14" style={{ color: accent }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div className="text-center animate-fade-up max-w-lg">
        {isWalkIn && (
          <>
            <h2 className="text-5xl font-bold text-white mb-3">You're in the queue!</h2>
            <p className="text-gray-400 text-2xl">
              {state.name ? `Thanks, ${state.name.split(' ')[0]}.` : ''} Please have a seat — we'll call you shortly.
            </p>
          </>
        )}
        {isCheckIn && (
          <>
            <h2 className="text-5xl font-bold text-white mb-3">You're checked in!</h2>
            <p className="text-gray-400 text-2xl">
              {state.name ? `Welcome, ${state.name.split(' ')[0]}.` : ''} Please have a seat — we'll be with you at {state.time}.
            </p>
            {state.service && <p className="text-gray-500 text-lg mt-2">{state.service}</p>}
          </>
        )}
        {isSchedule && (
          <>
            <h2 className="text-5xl font-bold text-white mb-3">You're booked!</h2>
            <p className="text-gray-400 text-2xl mb-2">
              {state.name ? `See you soon, ${state.name.split(' ')[0]}.` : 'See you soon.'}
            </p>
            <div className="mt-4 px-6 py-4 rounded-2xl inline-block" style={{ backgroundColor: accent + '15', border: `1px solid ${accent}30` }}>
              <p className="text-white text-xl font-semibold">{state.service}</p>
              <p className="text-gray-400 text-lg mt-0.5">{state.date} · {state.time}</p>
            </div>
          </>
        )}

        {/* Schedule next visit nudge — shown after walk-in or check-in */}
        {(isWalkIn || isCheckIn) && (
          <button
            onClick={() => navigate('/schedule')}
            className="mt-10 px-8 py-4 rounded-2xl text-xl font-semibold transition-all active:scale-[0.97] no-select border-2"
            style={{ borderColor: accent + '50', color: accent }}
          >
            Schedule your next visit
          </button>
        )}

        {/* Auto reset */}
        <p className="text-gray-700 text-lg mt-10">
          Returning to home in {countdown}s
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-2 text-gray-600 hover:text-gray-400 text-base transition-colors no-select"
        >
          Go now
        </button>
      </div>
    </div>
  )
}
