import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const PAGE_SIZE = 10

function StatusBadge({ status }) {
  const styles = {
    pending: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    confirmed: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    cancelled: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.cancelled}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

export default function BookingsList() {
  const { user, profile } = useAuth()
  const [bookings, setBookings] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [confirmCancel, setConfirmCancel] = useState(null)
  const [updating, setUpdating] = useState(null)

  const fetchBookings = useCallback(async () => {
    if (!user) return
    setLoading(true)

    let query = supabase
      .from('bookings')
      .select('*, services(name, duration_minutes, price)', { count: 'exact' })
      .eq('org_id', profile?.org_id ?? '') // org-scoped — profile.org_id set by AuthContext
      .order('preferred_date', { ascending: false })
      .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1)

    if (filter !== 'all') {
      query = query.eq('status', filter)
    }

    const { data, count, error } = await query
    if (!error) {
      setBookings(data || [])
      setTotal(count || 0)
    }
    setLoading(false)
  }, [user, page, filter])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  // Reset page when filter changes
  useEffect(() => {
    setPage(0)
  }, [filter])

  async function handleConfirm(booking) {
    setUpdating(booking.id)

    // 1. Parse preferred_date + preferred_time into a scheduled_at timestamp
    const scheduledAt = new Date(booking.preferred_date + 'T' + (booking.preferred_time || '09:00') + ':00').toISOString()

    // 2. Create the appointments row
    const { data: appt } = await supabase
      .from('appointments')
      .insert({
        org_id: booking.org_id,
        service_id: booking.service_id,
        scheduled_at: scheduledAt,
        status: 'confirmed',
        amount: booking.services?.price || 0,
        notes: booking.notes || null,
        // client_id: null — client may not exist yet in the clients table; staff can link later
      })
      .select('id')
      .single()

    // 3. Update booking: set status + link to appointment
    await supabase
      .from('bookings')
      .update({
        status: 'confirmed',
        appointment_id: appt?.id ?? null,
      })
      .eq('id', booking.id)

    // 4. Fire-and-forget: trigger appointment-confirmed notification (non-blocking)
    if (appt?.id) {
      supabase.functions.invoke('appointment-confirmed', { body: { appointment_id: appt.id } })
        .catch(() => { /* notification failure is non-fatal */ })
    }

    await fetchBookings()
    setUpdating(null)
  }

  async function handleCancel(bookingId) {
    setUpdating(bookingId)
    await supabase
      .from('bookings')
      .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
      .eq('id', bookingId)
    setConfirmCancel(null)
    await fetchBookings()
    setUpdating(null)
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)
  const from = total === 0 ? 0 : page * PAGE_SIZE + 1
  const to = Math.min(page * PAGE_SIZE + PAGE_SIZE, total)

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white">Bookings</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage all client appointments</p>
        </div>
        <div className="flex items-center gap-2">
          {['all', 'pending', 'confirmed', 'cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${
                filter === f
                  ? 'bg-amber-500 text-[#080f1d]'
                  : 'bg-gray-800 text-gray-400 border border-gray-700 hover:text-white hover:bg-gray-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm">No bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Date / Time</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {bookings.map(booking => {
                  const dateStr = booking.preferred_date
                    ? new Date(booking.preferred_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : '—'
                  const timeStr = booking.preferred_time
                    ? new Date('1970-01-01T' + booking.preferred_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
                    : '—'
                  const isCancelling = confirmCancel === booking.id
                  const isUpdating = updating === booking.id

                  return (
                    <tr key={booking.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-white text-sm font-medium">{booking.name}</p>
                        {booking.email && (
                          <p className="text-gray-500 text-xs mt-0.5">{booking.email}</p>
                        )}
                        {booking.phone && (
                          <p className="text-gray-500 text-xs">{booking.phone}</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-gray-300 text-sm">{booking.services?.name || '—'}</p>
                        {booking.services?.duration_minutes && (
                          <p className="text-gray-500 text-xs mt-0.5">{booking.services.duration_minutes} min</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-gray-300 text-sm">{dateStr}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{timeStr}</p>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {isUpdating ? (
                            <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                          ) : isCancelling ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">Cancel?</span>
                              <button
                                onClick={() => handleCancel(booking.id)}
                                className="px-2.5 py-1 text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setConfirmCancel(null)}
                                className="px-2.5 py-1 text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <>
                              {booking.status === 'pending' && (
                                <button
                                  onClick={() => handleConfirm(booking)}
                                  className="px-3 py-1.5 text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg hover:bg-amber-500/20 transition-colors"
                                >
                                  Confirm
                                </button>
                              )}
                              {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                <button
                                  onClick={() => setConfirmCancel(booking.id)}
                                  className="px-3 py-1.5 text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700 rounded-lg hover:text-red-400 hover:border-red-500/30 transition-colors"
                                >
                                  Cancel
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {total > 0 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-800">
            <p className="text-gray-500 text-sm">
              Showing {from}–{to} of {total}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1.5 text-sm text-gray-400 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-gray-500 text-sm">{page + 1} / {totalPages || 1}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-3 py-1.5 text-sm text-gray-400 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
