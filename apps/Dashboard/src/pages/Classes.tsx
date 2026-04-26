import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useToast } from '../context/ToastContext'
import { logActivity } from '../lib/logActivity'
import Modal from '../components/Modal'
import EmptyState from '../components/EmptyState'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function Classes() {
  const { profile } = useAuth()
  const { showToast } = useToast()
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [staff, setStaff] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [dayFilter, setDayFilter] = useState('')
  const fetchGen = useRef(0)

  const orgId = profile?.org_id
  const isManager = profile?.role === 'admin' || profile?.role === 'manager'

  // Form state
  const [form, setForm] = useState({
    name: '', description: '', instructor_id: '',
    day_of_week: 1, start_time: '09:00', end_time: '10:00',
    capacity: 10, location: '',
  })

  useEffect(() => {
    if (!orgId) return
    fetchClasses()
    // Load staff for instructor dropdown
    supabase.from('profiles').select('id, full_name').eq('org_id', orgId).eq('is_active', true)
      .in('role', ['admin', 'manager', 'staff']).order('full_name')
      .then(({ data }) => setStaff(data || []))
  }, [orgId])

  async function fetchClasses() {
    const gen = ++fetchGen.current
    setLoading(true)
    try {
      let query = supabase
        .from('classes')
        .select('*, instructor:profiles!instructor_id(full_name)')
        .eq('org_id', orgId)
        .order('day_of_week')
        .order('start_time')

      if (dayFilter !== '') query = query.eq('day_of_week', parseInt(dayFilter))

      const { data, error } = await query
      if (error) throw error
      if (gen === fetchGen.current) setClasses(data || [])
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      if (gen === fetchGen.current) setLoading(false)
    }
  }

  useEffect(() => {
    if (orgId) fetchClasses()
  }, [dayFilter])

  function openCreate() {
    setEditing(null)
    setForm({
      name: '', description: '', instructor_id: '',
      day_of_week: 1, start_time: '09:00', end_time: '10:00',
      capacity: 10, location: '',
    })
    setShowModal(true)
  }

  function openEdit(cls) {
    setEditing(cls)
    // Compute end_time from start_time + duration_minutes
    const st = cls.start_time?.slice(0, 5) || '09:00'
    const dur = cls.duration_minutes || 60
    const [sh, sm] = st.split(':').map(Number)
    const totalMin = sh * 60 + sm + dur
    const et = `${String(Math.floor(totalMin / 60) % 24).padStart(2, '0')}:${String(totalMin % 60).padStart(2, '0')}`
    setForm({
      name: cls.name,
      description: cls.description || '',
      instructor_id: cls.instructor_id || '',
      day_of_week: cls.day_of_week,
      start_time: st,
      end_time: et,
      capacity: cls.capacity || 10,
      location: cls.location || '',
    })
    setShowModal(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      // Compute duration_minutes from start_time and end_time
      const [sh, sm] = form.start_time.split(':').map(Number)
      const [eh, em] = form.end_time.split(':').map(Number)
      let dur = (eh * 60 + em) - (sh * 60 + sm)
      if (dur <= 0) dur += 24 * 60 // handle overnight

      const payload = {
        org_id: orgId,
        name: form.name.trim(),
        description: form.description.trim() || null,
        instructor_id: form.instructor_id || null,
        service_id: null,
        day_of_week: parseInt(form.day_of_week),
        start_time: form.start_time,
        duration_minutes: dur,
        capacity: parseInt(form.capacity),
        location: form.location.trim() || null,
      }

      if (editing) {
        const { error } = await supabase.from('classes').update(payload).eq('id', editing.id)
        if (error) throw error
        showToast('Class updated', 'success')
      } else {
        const { error } = await supabase.from('classes').insert(payload)
        if (error) throw error
        logActivity({ org_id: orgId, action: 'class.created', entity_type: 'class', metadata: { class_name: form.name.trim() } })
        showToast('Class created', 'success')
      }

      setShowModal(false)
      fetchClasses()
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(cls) {
    try {
      const { error } = await supabase.from('classes').update({ is_active: !cls.is_active }).eq('id', cls.id)
      if (error) throw error
      showToast(cls.is_active ? 'Class deactivated' : 'Class reactivated', 'success')
      fetchClasses()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Classes</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage group sessions, workshops, and recurring classes</p>
        </div>
        {isManager && (
          <button onClick={openCreate}
            className="bg-brand hover:bg-brand text-[#0c1a2e] font-medium text-sm px-4 py-2 rounded-lg transition-colors">
            + New Class
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <select value={dayFilter} onChange={e => setDayFilter(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white">
          <option value="">All days</option>
          {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      ) : classes.length === 0 ? (
        <EmptyState
          icon="calendar"
          title="No classes"
          message={dayFilter !== '' ? 'No classes on this day' : 'Create your first class to get started'}
          ctaLabel={isManager ? '+ New Class' : undefined}
          onCta={isManager ? openCreate : undefined}
        />
      ) : (
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-800">
                <th className="px-4 py-3 font-medium">Class</th>
                <th className="px-4 py-3 font-medium">Day</th>
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Duration</th>
                <th className="px-4 py-3 font-medium">Instructor</th>
                <th className="px-4 py-3 font-medium">Capacity</th>
                <th className="px-4 py-3 font-medium">Status</th>
                {isManager && <th className="px-4 py-3 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {classes.map(cls => (
                <tr key={cls.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="px-4 py-3">
                    <div className="text-white font-medium">{cls.name}</div>
                    {cls.location && <div className="text-xs text-gray-600">{cls.location}</div>}
                  </td>
                  <td className="px-4 py-3 text-gray-300">{DAYS_SHORT[cls.day_of_week]}</td>
                  <td className="px-4 py-3 text-gray-300">{cls.start_time?.slice(0, 5)}</td>
                  <td className="px-4 py-3 text-gray-400">{cls.duration_minutes}min</td>
                  <td className="px-4 py-3 text-gray-300">{cls.instructor?.full_name || '—'}</td>
                  <td className="px-4 py-3 text-gray-300">{cls.capacity}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      cls.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-600/20 text-gray-400'
                    }`}>
                      {cls.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  {isManager && (
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button onClick={() => openEdit(cls)}
                          className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 transition-colors">
                          Edit
                        </button>
                        <button onClick={() => toggleActive(cls)}
                          className={`text-xs px-2 py-1 rounded transition-colors ${
                            cls.is_active
                              ? 'text-red-400 bg-red-500/10 hover:bg-red-500/20'
                              : 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
                          }`}>
                          {cls.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Class' : 'New Class'} size="md">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Name *</label>
            <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600"
              placeholder="e.g. Morning Yoga" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 h-20 resize-none"
              placeholder="Optional description" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Day of Week *</label>
              <select value={form.day_of_week} onChange={e => setForm({ ...form, day_of_week: e.target.value })}
                className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white">
                {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Start Time *</label>
              <input type="time" required value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })}
                className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">End Time *</label>
              <input type="time" required value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })}
                className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Capacity</label>
              <input type="number" min="1" max="500" value={form.capacity}
                onChange={e => setForm({ ...form, capacity: e.target.value })}
                className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Instructor</label>
            <select value={form.instructor_id} onChange={e => setForm({ ...form, instructor_id: e.target.value })}
              className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white">
              <option value="">No instructor</option>
              {staff.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
            <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
              className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600"
              placeholder="e.g. Studio A" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="bg-brand hover:bg-brand text-[#0c1a2e] font-medium text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
              {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
