import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function UpcomingBookings() {
  const { profile } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [actioning, setActioning] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!profile?.org_id) return
    fetchBookings()
  }, [profile?.org_id])

  async function fetchBookings() {
    setLoading(true)
    setError(false)
    try {
      const { data } = await supabase
        .from('bookings')
        .select('id, preferred_date, preferred_time, notes, created_at, service_id, slot_id, services(name, duration_minutes), name, email, phone')
        .eq('org_id', profile.org_id)
        .eq('status', 'pending')
        .order('created_at')
        .limit(10)

      setBookings(data || [])
    } catch {
      setError(true)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  async function handleConfirm(booking) {
    setActioning(booking.id)
    try {
      // Build scheduled_at from slot or preferred date+time
      let scheduledAt
      if (booking.slot_id) {
        // Fetch the slot's start_time to use as scheduled_at
        const { data: slot } = await supabase
          .from('slots')
          .select('start_time')
          .eq('id', booking.slot_id)
          .single()
        scheduledAt = slot?.start_time ?? new Date().toISOString()
      } else if (booking.preferred_date && booking.preferred_time) {
        scheduledAt = new Date(`${booking.preferred_date}T${booking.preferred_time}`).toISOString()
      } else {
        scheduledAt = new Date().toISOString()
      }

      // Create appointment row
      const { data: appt } = await supabase
        .from('appointments')
        .insert({
          org_id:           profile.org_id,
          service_id:       booking.service_id ?? null,
          scheduled_at:     scheduledAt,
          duration_minutes: booking.services?.duration_minutes ?? 60,
          status:           'confirmed',
          notes:            booking.notes ?? null,
          amount:           0,
        })
        .select('id')
        .single()

      // Update booking: confirmed + link to appointment
      await supabase
        .from('bookings')
        .update({ status: 'confirmed', appointment_id: appt?.id ?? null })
        .eq('id', booking.id)

      await fetchBookings()
    } catch {
      // silent — spinner cleared in finally
    } finally {
      setActioning(null)
    }
  }

  async function handleDecline(id) {
    setActioning(id)
    try {
      await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', id)
      await fetchBookings()
    } catch {
      // silent — spinner cleared in finally
    } finally {
      setActioning(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-red-400/70 text-sm text-center py-6">Unable to load — try refreshing</p>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm">No pending booking requests</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {bookings.map(booking => {
        const isLoading = actioning === booking.id
        const dateStr = booking.preferred_date
          ? new Date(booking.preferred_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          : null
        const timeStr = booking.preferred_time
          ? new Date('1970-01-01T' + booking.preferred_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
          : null
        const hasSlot = !!booking.slot_id

        return (
          <div key={booking.id} className="p-2.5 rounded-lg bg-gray-800/50">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{booking.name || '—'}</p>
                <p className="text-xs text-gray-500 truncate">
                  {booking.services?.name ?? '—'}
                  {dateStr && ` · ${dateStr}`}
                  {timeStr && ` at ${timeStr}`}
                  {hasSlot && <span className="ml-1 text-blue-400/70">· slot</span>}
                </p>
                {booking.notes && (
                  <p className="text-xs text-gray-600 truncate mt-0.5">"{booking.notes}"</p>
                )}
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button
                  onClick={() => handleConfirm(booking)}
                  disabled={isLoading}
                  className="text-xs px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors font-medium disabled:opacity-50"
                >
                  {isLoading ? '...' : 'Confirm'}
                </button>
                <button
                  onClick={() => handleDecline(booking.id)}
                  disabled={isLoading}
                  className="text-xs px-2 py-1 rounded-md bg-gray-700 text-gray-400 border border-gray-600 hover:bg-gray-600 hover:text-white transition-colors font-medium disabled:opacity-50"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
