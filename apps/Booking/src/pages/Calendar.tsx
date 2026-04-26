import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const CAL_START = 8   // 8am
const CAL_END   = 19  // 7pm
const ROW_H     = 56  // px per 30-min slot

function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

function getMonday(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function formatHeaderDate(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatWeekRange(start) {
  const end = addDays(start, 6)
  const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return `${startStr} – ${endStr}`
}

function formatTime12(date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

function formatHour(h) {
  if (h === 0 || h === 24) return '12am'
  if (h === 12) return '12pm'
  return h < 12 ? `${h}am` : `${h - 12}pm`
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const TOTAL_SLOTS = (CAL_END - CAL_START) * 2  // 30-min slots

export default function Calendar() {
  const { user } = useAuth()
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()))
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [nowY, setNowY] = useState(null)
  const [nowDayIndex, setNowDayIndex] = useState(null)

  useEffect(() => {
    if (!user) return
    async function fetchBookings() {
      setLoading(true)
      const weekEnd = addDays(weekStart, 7)
      const { data, error } = await supabase
        .from('bookings')
        .select('*, services(name, duration_minutes)')
        .eq('user_id', user.id)
        .gte('scheduled_at', weekStart.toISOString())
        .lt('scheduled_at', weekEnd.toISOString())
        .neq('status', 'cancelled')
      setBookings(data || [])
      setLoading(false)
    }
    fetchBookings()
  }, [weekStart, user])

  useEffect(() => {
    function updateNow() {
      const now = new Date()
      const monday = getMonday(now)
      const isCurrentWeek = monday.toDateString() === weekStart.toDateString()
      if (!isCurrentWeek) {
        setNowY(null)
        setNowDayIndex(null)
        return
      }
      const dayOfWeek = now.getDay()
      const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1
      const totalMinutes = now.getHours() * 60 + now.getMinutes()
      const calStartMinutes = CAL_START * 60
      const calEndMinutes = CAL_END * 60
      if (totalMinutes < calStartMinutes || totalMinutes > calEndMinutes) {
        setNowY(null)
        setNowDayIndex(null)
        return
      }
      const minutesFromStart = totalMinutes - calStartMinutes
      const y = (minutesFromStart / 30) * ROW_H
      setNowY(y)
      setNowDayIndex(dayIndex)
    }
    updateNow()
    const interval = setInterval(updateNow, 60000)
    return () => clearInterval(interval)
  }, [weekStart])

  function getBookingStyle(booking, dayIndex) {
    const bDate = new Date(booking.scheduled_at)
    const topPx = ((bDate.getHours() - CAL_START) * 2 + bDate.getMinutes() / 30) * ROW_H
    const heightPx = Math.max(((booking.services?.duration_minutes || 60) / 30) * ROW_H - 4, ROW_H - 4)
    return { top: topPx + 2, height: heightPx }
  }

  function getBookingColors(status) {
    if (status === 'confirmed') return 'bg-amber-500/20 border-amber-500/50 text-amber-300'
    return 'bg-blue-500/20 border-blue-500/50 text-blue-300'
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const calendarHeight = TOTAL_SLOTS * ROW_H

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white">Calendar</h1>
          <p className="text-gray-400 text-sm mt-0.5">{formatWeekRange(weekStart)}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekStart(getMonday(new Date()))}
            className="px-3 py-1.5 text-sm text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => setWeekStart(w => addDays(w, -7))}
            className="p-1.5 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setWeekStart(w => addDays(w, 7))}
            className="p-1.5 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && (
        <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl overflow-auto">
          <div className="min-w-[700px]">
            {/* Day headers */}
            <div className="flex border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
              <div className="w-14 shrink-0" />
              {DAY_LABELS.map((label, i) => {
                const dayDate = addDays(weekStart, i)
                const isToday = dayDate.toDateString() === today.toDateString()
                return (
                  <div
                    key={i}
                    className={`flex-1 text-center py-3 border-l border-gray-800 ${isToday ? '' : ''}`}
                  >
                    <p className={`text-xs font-medium uppercase tracking-wider ${isToday ? 'text-amber-500' : 'text-gray-500'}`}>
                      {label}
                    </p>
                    <p className={`text-sm font-semibold mt-0.5 ${isToday ? 'text-amber-500' : 'text-white'}`}>
                      {dayDate.getDate()}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Time grid */}
            <div className="flex relative" style={{ height: calendarHeight }}>
              {/* Time labels */}
              <div className="w-14 shrink-0 relative">
                {Array.from({ length: CAL_END - CAL_START + 1 }, (_, i) => i).map(i => (
                  <div
                    key={i}
                    className="absolute right-2 text-xs text-gray-600"
                    style={{ top: i * ROW_H * 2 - 8 }}
                  >
                    {formatHour(CAL_START + i)}
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {DAY_LABELS.map((_, dayIndex) => {
                const dayDate = addDays(weekStart, dayIndex)
                const isToday = dayDate.toDateString() === today.toDateString()
                const dayBookings = bookings.filter(b => {
                  const bDate = new Date(b.scheduled_at)
                  return bDate.toDateString() === dayDate.toDateString()
                })

                return (
                  <div
                    key={dayIndex}
                    className={`flex-1 relative border-l border-gray-800 ${isToday ? 'bg-amber-500/[0.02]' : ''}`}
                  >
                    {/* Horizontal grid lines every 30 min */}
                    {Array.from({ length: TOTAL_SLOTS }, (_, i) => (
                      <div
                        key={i}
                        className={`absolute left-0 right-0 border-t ${i % 2 === 0 ? 'border-gray-800' : 'border-gray-800/40'}`}
                        style={{ top: i * ROW_H }}
                      />
                    ))}

                    {/* Current time indicator */}
                    {nowY !== null && nowDayIndex === dayIndex && (
                      <div
                        className="absolute left-0 right-0 z-20 flex items-center pointer-events-none"
                        style={{ top: nowY }}
                      >
                        <div className="w-2 h-2 rounded-full bg-amber-500 -ml-1 shrink-0" />
                        <div className="flex-1 h-px bg-amber-500" />
                      </div>
                    )}

                    {/* Booking blocks */}
                    {dayBookings.map(booking => {
                      const style = getBookingStyle(booking, dayIndex)
                      const colors = getBookingColors(booking.status)
                      const bDate = new Date(booking.scheduled_at)
                      return (
                        <button
                          key={booking.id}
                          onClick={() => setSelectedBooking(booking)}
                          style={{ top: style.top, height: style.height }}
                          className={`absolute left-1 right-1 rounded border ${colors} px-1.5 py-1 text-left overflow-hidden transition-opacity hover:opacity-80`}
                        >
                          <p className="font-medium text-xs leading-tight truncate">{booking.client_name}</p>
                          {style.height > ROW_H && (
                            <p className="text-xs opacity-75 truncate mt-0.5">{booking.services?.name}</p>
                          )}
                          {style.height > ROW_H * 1.5 && (
                            <p className="text-xs opacity-60 mt-0.5">{formatTime12(bDate)}</p>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={e => { if (e.target === e.currentTarget) setSelectedBooking(null) }}
        >
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-white font-semibold text-lg">{selectedBooking.client_name}</h3>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 border ${
                  selectedBooking.status === 'confirmed'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                }`}>
                  {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                </span>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              {selectedBooking.client_email && (
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-300 text-sm">{selectedBooking.client_email}</span>
                </div>
              )}
              {selectedBooking.client_phone && (
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-300 text-sm">{selectedBooking.client_phone}</span>
                </div>
              )}
              {selectedBooking.services && (
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  <span className="text-gray-300 text-sm">{selectedBooking.services.name} ({selectedBooking.services.duration_minutes} min)</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-300 text-sm">
                  {new Date(selectedBooking.scheduled_at).toLocaleDateString('en-US', {
                    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                  })} at {formatTime12(new Date(selectedBooking.scheduled_at))}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedBooking(null)}
              className="mt-6 w-full bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
