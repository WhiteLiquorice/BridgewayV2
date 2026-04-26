import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useToast } from '../context/ToastContext'
import Modal from '../components/Modal'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getWeekDates(offset = 0) {
  const now = new Date()
  const start = new Date(now)
  start.setDate(now.getDate() - now.getDay() + offset * 7)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d.toISOString().split('T')[0]
  })
}

function fmtTime(t) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hr = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${hr}:${String(m).padStart(2, '0')} ${ampm}`
}

export default function StaffSchedule() {
  const { profile } = useAuth()
  const { showToast } = useToast()
  const [staff, setStaff] = useState([])
  const [shifts, setShifts] = useState([])
  const [loading, setLoading] = useState(true)
  const [weekOffset, setWeekOffset] = useState(0)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ staff_id: '', shift_date: '', start_time: '09:00', end_time: '17:00', notes: '' })
  const [saving, setSaving] = useState(false)

  const weekDates = getWeekDates(weekOffset)
  const weekStart = weekDates[0]
  const weekEnd = weekDates[6]

  useEffect(() => {
    if (!profile?.org_id) return
    loadData()
  }, [profile?.org_id, weekOffset])

  async function loadData() {
    setLoading(true)
    try {
      const [staffRes, shiftRes] = await Promise.all([
        supabase.from('profiles').select('id, full_name, role, email')
          .eq('org_id', profile.org_id).in('role', ['admin', 'manager', 'staff']).eq('is_active', true).order('full_name'),
        supabase.from('staff_shifts').select('*')
          .eq('org_id', profile.org_id).gte('shift_date', weekStart).lte('shift_date', weekEnd)
          .order('start_time'),
      ])
      setStaff(staffRes.data || [])
      setShifts(shiftRes.data || [])
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!form.staff_id || !form.shift_date) return
    setSaving(true)
    try {
      const { error } = await supabase.from('staff_shifts').insert({
        org_id: profile.org_id,
        staff_id: form.staff_id,
        shift_date: form.shift_date,
        start_time: form.start_time,
        end_time: form.end_time,
        notes: form.notes.trim() || null,
      })
      if (error) throw error
      showToast('Shift added', 'success')
      setShowAdd(false)
      setForm({ staff_id: '', shift_date: '', start_time: '09:00', end_time: '17:00', notes: '' })
      loadData()
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function deleteShift(shiftId) {
    try {
      await supabase.from('staff_shifts').delete().eq('id', shiftId)
      showToast('Shift removed', 'success')
      loadData()
    } catch { /* ignore */ }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Build grid: rows = staff, cols = days
  const staffMap = {}
  staff.forEach(s => { staffMap[s.id] = s })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Staff Schedule</h1>
          <p className="text-sm text-gray-500 mt-0.5">Weekly shift schedule</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand text-[#0c1a2e] text-sm font-semibold rounded-lg transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
          </svg>
          Add Shift
        </button>
      </div>

      {/* Week navigation */}
      <div className="flex items-center gap-4">
        <button onClick={() => setWeekOffset(w => w - 1)}
          className="px-3 py-1.5 text-sm text-gray-400 hover:text-white border border-gray-700 rounded-lg transition-colors">
          &larr; Prev
        </button>
        <span className="text-sm text-gray-300">
          {new Date(weekStart + 'T00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          {' \u2013 '}
          {new Date(weekEnd + 'T00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <button onClick={() => setWeekOffset(w => w + 1)}
          className="px-3 py-1.5 text-sm text-gray-400 hover:text-white border border-gray-700 rounded-lg transition-colors">
          Next &rarr;
        </button>
        {weekOffset !== 0 && (
          <button onClick={() => setWeekOffset(0)}
            className="text-xs text-brand hover:text-brand transition-colors">Today</button>
        )}
      </div>

      {/* Schedule grid */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide w-40 sticky left-0 bg-gray-900">Staff</th>
                {weekDates.map((date, i) => {
                  const d = new Date(date + 'T00:00')
                  const isToday = date === new Date().toISOString().split('T')[0]
                  return (
                    <th key={date} className={`text-center px-2 py-3 text-xs font-medium uppercase tracking-wide min-w-[100px] ${isToday ? 'text-brand' : 'text-gray-500'}`}>
                      <div>{DAYS[i]}</div>
                      <div className={`text-sm font-semibold mt-0.5 ${isToday ? 'text-brand' : 'text-gray-300'}`}>
                        {d.getDate()}
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {staff.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">No staff members</td></tr>
              )}
              {staff.map(member => (
                <tr key={member.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-white font-medium truncate sticky left-0 bg-gray-900">
                    {member.full_name || member.email}
                  </td>
                  {weekDates.map(date => {
                    const dayShifts = shifts.filter(s => s.staff_id === member.id && s.shift_date === date)
                    return (
                      <td key={date} className="px-2 py-2 text-center">
                        {dayShifts.length === 0 ? (
                          <span className="text-gray-700">&mdash;</span>
                        ) : (
                          dayShifts.map(shift => (
                            <div key={shift.id} className="group bg-brand/10 border border-brand/20 rounded px-1.5 py-1 text-xs text-brand mb-1 relative">
                              <div>{fmtTime(shift.start_time)}</div>
                              <div>{fmtTime(shift.end_time)}</div>
                              {shift.notes && <div className="text-gray-500 truncate">{shift.notes}</div>}
                              <button
                                onClick={() => deleteShift(shift.id)}
                                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                              >
                                &times;
                              </button>
                            </div>
                          ))
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Shift Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Shift" size="sm">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Staff Member *</label>
            <select required value={form.staff_id} onChange={e => setForm(f => ({ ...f, staff_id: e.target.value }))}
              className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white">
              <option value="">Select staff...</option>
              {staff.map(s => <option key={s.id} value={s.id}>{s.full_name || s.email}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Date *</label>
            <input type="date" required value={form.shift_date} onChange={e => setForm(f => ({ ...f, shift_date: e.target.value }))}
              className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Start Time</label>
              <input type="time" value={form.start_time} onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))}
                className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">End Time</label>
              <input type="time" value={form.end_time} onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))}
                className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
            <input type="text" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600"
              placeholder="e.g. Front desk, Opening shift" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAdd(false)} className="text-sm text-gray-400 px-4 py-2">Cancel</button>
            <button type="submit" disabled={saving}
              className="bg-brand hover:bg-brand text-[#0c1a2e] font-medium text-sm px-4 py-2 rounded-lg disabled:opacity-50">
              {saving ? 'Saving...' : 'Add Shift'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
