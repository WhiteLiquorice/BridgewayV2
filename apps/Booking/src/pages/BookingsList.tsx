import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { collection, query, orderBy, limit, startAfter, getDocs, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore'
import { db, createCalendarEvent } from '../lib/firebase'

const PAGE_SIZE = 10

function StatusBadge({ status }) {
  const styles = {
    pending:   'bg-blue-500/10 text-blue-400 border-blue-500/20',
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
  const { user, orgConfig } = useAuth()
  const [bookings, setBookings]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [filter, setFilter]             = useState('all')
  const [page, setPage]                 = useState(0)
  const [cursors, setCursors]           = useState([null]) // cursors[i] = startAfter doc for page i
  const [hasMore, setHasMore]           = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(null)
  const [updating, setUpdating]         = useState(null)

  const fetchPage = useCallback(async (pageIndex: number) => {
    if (!user || !orgConfig) return
    setLoading(true)

    const bookingsRef = collection(db, 'bookings')
    const constraints: any[] = [orderBy('createdAt', 'desc'), limit(PAGE_SIZE + 1)]

    if (filter !== 'all') constraints.push(/* where('status', '==', filter) — add this below */)

    // Build query — Firestore doesn't support OR filter, so we filter client-side for 'all'
    let q = query(bookingsRef, orderBy('createdAt', 'desc'), limit(PAGE_SIZE + 1))

    if (filter !== 'all') {
      const { where } = await import('firebase/firestore')
      q = query(bookingsRef,
        where('orgId', '==', orgConfig.id),
        where('status', '==', filter),
        orderBy('createdAt', 'desc'),
        limit(PAGE_SIZE + 1),
      )
    } else {
      const { where } = await import('firebase/firestore')
      q = query(bookingsRef,
        where('orgId', '==', orgConfig.id),
        orderBy('createdAt', 'desc'),
        limit(PAGE_SIZE + 1),
      )
    }

    // Apply cursor for pagination
    if (pageIndex > 0 && cursors[pageIndex]) {
      const { startAfter: sa } = await import('firebase/firestore')
      q = query(q, sa(cursors[pageIndex]))
    }

    const snap = await getDocs(q)
    const docs = snap.docs.slice(0, PAGE_SIZE).map(d => ({ id: d.id, ...d.data() }))
    const more = snap.docs.length > PAGE_SIZE

    if (more && snap.docs[PAGE_SIZE]) {
      setCursors(prev => {
        const next = [...prev]
        next[pageIndex + 1] = snap.docs[PAGE_SIZE - 1]
        return next
      })
    }

    setBookings(docs)
    setHasMore(more)
    setLoading(false)
  }, [user, orgConfig, filter])

  useEffect(() => { setPage(0); setCursors([null]) }, [filter])
  useEffect(() => { fetchPage(page) }, [page, fetchPage])

  async function handleConfirm(booking) {
    setUpdating(booking.id)

    // 1. Update booking status to confirmed + set scheduledAt + init reminder flags
    const scheduledAt = new Date(booking.preferredDate + 'T' + (booking.preferredTime || '09:00') + ':00').toISOString()
    await updateDoc(doc(db, 'bookings', booking.id), {
      status: 'confirmed',
      scheduledAt,
      confirmedAt: serverTimestamp(),
      // Reminder flags — used by scheduled Cloud Functions to track sent state
      reminder24hSent: false,
      reminder2hSent:  false,
      // Denormalised fields needed by Cloud Functions (avoid extra Firestore reads)
      clientName:      booking.clientName  || null,
      clientEmail:     booking.clientEmail || null,
      clientPhone:     booking.clientPhone || null,
      serviceName:     booking.serviceName || null,
      durationMinutes: booking.durationMinutes || 60,
    })

    // 2. Fire Google Calendar event creation (non-blocking, non-fatal)
    createCalendarEvent({ bookingId: booking.id })
      .catch(() => { /* non-fatal */ })

    await fetchPage(page)
    setUpdating(null)
  }

  async function handleCancel(bookingId: string) {
    setUpdating(bookingId)
    await updateDoc(doc(db, 'bookings', bookingId), {
      status: 'cancelled',
      cancelledAt: serverTimestamp(),
    })
    setConfirmCancel(null)
    await fetchPage(page)
    setUpdating(null)
  }

  return (
    <div className="p-6">
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
                {bookings.map((booking: any) => {
                  const dateStr = booking.preferredDate
                    ? new Date(booking.preferredDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : '—'
                  const timeStr = booking.preferredTime
                    ? new Date('1970-01-01T' + booking.preferredTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
                    : '—'
                  const isCancelling = confirmCancel === booking.id
                  const isUpdating   = updating === booking.id

                  return (
                    <tr key={booking.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-white text-sm font-medium">{booking.clientName}</p>
                        {booking.clientEmail && <p className="text-gray-500 text-xs mt-0.5">{booking.clientEmail}</p>}
                        {booking.clientPhone && <p className="text-gray-500 text-xs">{booking.clientPhone}</p>}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-gray-300 text-sm">{booking.serviceName || '—'}</p>
                        {booking.durationMinutes && <p className="text-gray-500 text-xs mt-0.5">{booking.durationMinutes} min</p>}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-gray-300 text-sm">{dateStr}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{timeStr}</p>
                      </td>
                      <td className="px-5 py-4"><StatusBadge status={booking.status} /></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {isUpdating ? (
                            <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                          ) : isCancelling ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">Cancel?</span>
                              <button onClick={() => handleCancel(booking.id)} className="px-2.5 py-1 text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors">Yes</button>
                              <button onClick={() => setConfirmCancel(null)} className="px-2.5 py-1 text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors">No</button>
                            </div>
                          ) : (
                            <>
                              {booking.status === 'pending' && (
                                <button onClick={() => handleConfirm(booking)} className="px-3 py-1.5 text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg hover:bg-amber-500/20 transition-colors">
                                  Confirm
                                </button>
                              )}
                              {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                <button onClick={() => setConfirmCancel(booking.id)} className="px-3 py-1.5 text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700 rounded-lg hover:text-red-400 hover:border-red-500/30 transition-colors">
                                  Cancel
                                </button>
                              )}
                              {booking.googleEventLink && (
                                <a href={booking.googleEventLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-amber-400 transition-colors" title="View in Google Calendar">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </a>
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

        {(page > 0 || hasMore) && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-800">
            <p className="text-gray-500 text-sm">Page {page + 1}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1.5 text-sm text-gray-400 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >Previous</button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!hasMore}
                className="px-3 py-1.5 text-sm text-gray-400 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
