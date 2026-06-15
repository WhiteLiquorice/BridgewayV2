import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { dataconnect } from '../lib/firebase'
import { getUpcomingSlots, getOrgProfiles, createSlot, updateSlotStatus, deleteSlot } from '@bridgeway/database'

const inputCls = 'bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50'

function fmt(ts) {
  return new Date(ts).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
  })
}

export default function Availability() {
  const { profile } = useAuth()
  const [slots, setSlots]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [adding, setAdding]     = useState(false)
  const [addError, setAddError] = useState(null)

  // Form state
  const today = new Date().toISOString().slice(0, 10)
  const [date,       setDate]       = useState(today)
  const [startTime,  setStartTime]  = useState('09:00')
  const [endTime,    setEndTime]    = useState('10:00')
  const [staffId,    setStaffId]    = useState('')
  const [staffList,  setStaffList]  = useState([])

  useEffect(() => {
    if (!profile?.org_id) return
    fetchSlots()
    fetchStaff()
  }, [profile?.org_id])

  async function fetchSlots() {
    setLoading(true)
    try {
      const { data } = await getUpcomingSlots(dataconnect, { orgId: profile.org_id, now: new Date().toISOString() })
      setSlots((data?.slots || []).map((s: any) => ({
        id: s.id,
        start_time: s.startTime,
        end_time: s.endTime,
        status: s.status,
        staff_id: s.staff?.id,
        profiles: s.staff ? { full_name: s.staff.fullName } : null
      })))
    } catch {
      setSlots([])
    } finally {
      setLoading(false)
    }
  }

  async function fetchStaff() {
    try {
      const { data } = await getOrgProfiles(dataconnect, { orgId: profile.org_id })
      setStaffList((data?.profiles || [])
        .filter((p: any) => p.isActive && ['admin', 'manager', 'staff'].includes(p.role))
        .map((p: any) => ({
          id: p.id,
          full_name: p.fullName
        })))
    } catch {
      setStaffList([])
    }
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!date || !startTime || !endTime) return
    const start = new Date(`${date}T${startTime}`)
    const end   = new Date(`${date}T${endTime}`)
    if (end <= start) { setAddError('End time must be after start time.'); return }
    setAdding(true)
    setAddError(null)
    try {
      await createSlot(dataconnect, {
        orgId:     profile.org_id,
        startTime: start.toISOString(),
        endTime:   end.toISOString(),
        status:     'available',
        staffId:   staffId || null,
      })
      fetchSlots()
      // Reset form
      setStartTime('09:00')
      setEndTime('10:00')
    } catch {
      setAddError('Failed to add slot — check your connection.')
    } finally {
      setAdding(false)
    }
  }

  async function handleBlock(id) {
    try {
      await updateSlotStatus(dataconnect, { id, status: 'blocked' })
      setSlots(prev => prev.map(s => s.id === id ? { ...s, status: 'blocked' } : s))
    } catch { /* silent */ }
  }

  async function handleDelete(id) {
    try {
      await deleteSlot(dataconnect, { id })
      setSlots(prev => prev.filter(s => s.id !== id))
    } catch { /* silent */ }
  }

  const statusBadge = {
    available: 'bg-green-500/10 text-green-400 border border-green-500/20',
    booked:    'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    blocked:   'bg-gray-700 text-gray-400 border border-gray-600',
  }

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Availability</h1>
        <p className="text-sm text-gray-500 mt-0.5">Add and manage bookable time slots for patients.</p>
      </div>

      {/* Add slot form */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-white mb-4">Add a Slot</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Date</label>
              <input type="date" value={date} min={today}
                onChange={e => setDate(e.target.value)}
                className={inputCls + ' w-full'} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Start time</label>
              <input type="time" value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className={inputCls + ' w-full'} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">End time</label>
              <input type="time" value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className={inputCls + ' w-full'} required />
            </div>
          </div>

          {staffList.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Staff member (optional)</label>
              <select value={staffId} onChange={e => setStaffId(e.target.value)}
                className={inputCls + ' w-full sm:w-64'}>
                <option value="">Any staff</option>
                {staffList.map(s => (
                  <option key={s.id} value={s.id}>{s.full_name || s.id}</option>
                ))}
              </select>
            </div>
          )}

          {addError && <p className="text-red-400 text-xs">{addError}</p>}

          <button type="submit" disabled={adding}
            className="flex items-center gap-2 px-4 py-2 bg-brand/10 hover:bg-brand/20 text-brand text-sm font-medium border border-brand/20 rounded-lg disabled:opacity-50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {adding ? 'Adding…' : 'Add slot'}
          </button>
        </form>
      </div>

      {/* Slots list */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="text-sm font-semibold text-white">Upcoming Slots</h2>
        </div>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        ) : slots.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No upcoming slots — add one above.</p>
        ) : (
          <div className="divide-y divide-gray-800">
            {slots.map(slot => (
              <div key={slot.id} className="flex items-center justify-between px-6 py-3 gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{fmt(slot.start_time)} – {new Date(slot.end_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</p>
                  {slot.profiles?.full_name && (
                    <p className="text-xs text-gray-500 mt-0.5">{slot.profiles.full_name}</p>
                  )}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[slot.status] || statusBadge.blocked}`}>
                  {slot.status}
                </span>
                <div className="flex gap-1.5">
                  {slot.status === 'available' && (
                    <button onClick={() => handleBlock(slot.id)}
                      className="text-xs px-2 py-1 text-gray-500 hover:text-gray-300 border border-gray-700 rounded-md transition-colors">
                      Block
                    </button>
                  )}
                  {slot.status !== 'booked' && (
                    <button onClick={() => handleDelete(slot.id)}
                      className="text-xs px-2 py-1 text-red-500/70 hover:text-red-400 border border-gray-700 hover:border-red-500/30 rounded-md transition-colors">
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
