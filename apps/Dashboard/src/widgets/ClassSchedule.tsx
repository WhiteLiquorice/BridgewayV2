import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useToast } from '../context/ToastContext'
import EmptyState from '../components/EmptyState'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_COLORS = [
  'bg-rose-500/20 text-rose-400 border-rose-500/30',
  'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'bg-brand/20 text-brand border-brand/30',
  'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'bg-pink-500/20 text-pink-400 border-pink-500/30',
]

export default function ClassSchedule() {
  const { profile } = useAuth()
  const { showToast } = useToast()
  const [classes, setClasses] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedClass, setSelectedClass] = useState(null)
  const [attendanceDate, setAttendanceDate] = useState(() => {
    const d = new Date()
    return d.toISOString().split('T')[0]
  })
  const [attendees, setAttendees] = useState([])
  const [loadingAttendees, setLoadingAttendees] = useState(false)

  const orgId = profile?.org_id

  useEffect(() => {
    if (!orgId) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const { data: cls, error: clsErr } = await supabase
          .from('classes')
          .select('*, instructor:profiles!instructor_id(full_name)')
          .eq('org_id', orgId)
          .eq('is_active', true)
          .order('day_of_week')
          .order('start_time')

        if (clsErr) throw clsErr
        if (!cancelled) setClasses(cls || [])
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [orgId])

  // Group classes by day
  const byDay = useMemo(() => {
    const map = {}
    for (let i = 0; i < 7; i++) map[i] = []
    classes.forEach(c => {
      if (map[c.day_of_week]) map[c.day_of_week].push(c)
    })
    return map
  }, [classes])

  // Load attendance for selected class + date
  useEffect(() => {
    if (!selectedClass || !attendanceDate || !orgId) return
    let cancelled = false

    async function loadAttendance() {
      setLoadingAttendees(true)
      try {
        const { data, error: err } = await supabase
          .from('class_registrations')
          .select('*, client:clients!client_id(name, email, phone)')
          .eq('org_id', orgId)
          .eq('class_id', selectedClass.id)
          .eq('class_date', attendanceDate)
          .order('created_at')

        if (err) throw err
        if (!cancelled) setAttendees(data || [])
      } catch {
        if (!cancelled) setAttendees([])
      } finally {
        if (!cancelled) setLoadingAttendees(false)
      }
    }

    loadAttendance()
    return () => { cancelled = true }
  }, [selectedClass, attendanceDate, orgId])

  async function markAttendance(regId, newStatus) {
    try {
      const { error: err } = await supabase
        .from('class_registrations')
        .update({ status: newStatus })
        .eq('id', regId)

      if (err) throw err
      setAttendees(prev => prev.map(a => a.id === regId ? { ...a, status: newStatus } : a))
      showToast(`Marked as ${newStatus}`, 'success')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="text-sm text-red-400 p-4">{error}</div>
  }

  if (classes.length === 0) {
    return <EmptyState icon="calendar" title="No classes" message="Create your first class from the Classes page" />
  }

  // Attendance modal overlay
  if (selectedClass) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button onClick={() => setSelectedClass(null)} className="text-sm text-brand hover:text-brand flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
          <input
            type="date"
            value={attendanceDate}
            onChange={e => setAttendanceDate(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-xs text-white"
          />
        </div>

        <div className="text-sm text-white font-medium">{selectedClass.name}</div>
        <div className="text-xs text-gray-500">
          {DAYS[selectedClass.day_of_week]} · {selectedClass.start_time?.slice(0, 5)} · {selectedClass.duration_minutes}min
          {selectedClass.instructor?.full_name && ` · ${selectedClass.instructor.full_name}`}
        </div>

        {loadingAttendees ? (
          <div className="flex justify-center py-4">
            <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        ) : attendees.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-4">No registrations for this date</p>
        ) : (
          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {attendees.map(a => (
              <div key={a.id} className="flex items-center justify-between bg-gray-800/60 rounded-lg px-3 py-2">
                <div>
                  <span className="text-sm text-white">{a.client?.name || 'Unknown'}</span>
                  <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                    a.status === 'attended' ? 'bg-emerald-500/20 text-emerald-400' :
                    a.status === 'no_show' ? 'bg-red-500/20 text-red-400' :
                    a.status === 'waitlisted' ? 'bg-brand/20 text-brand' :
                    a.status === 'cancelled' ? 'bg-gray-600/20 text-gray-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>{a.status}</span>
                </div>
                {(a.status === 'registered' || a.status === 'waitlisted') && (
                  <div className="flex gap-1">
                    <button onClick={() => markAttendance(a.id, 'attended')}
                      className="text-xs bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 px-2 py-1 rounded">
                      Present
                    </button>
                    <button onClick={() => markAttendance(a.id, 'no_show')}
                      className="text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 px-2 py-1 rounded">
                      No Show
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Weekly grid view
  const today = new Date().getDay()

  return (
    <div className="space-y-2">
      {/* Compact day tabs showing today first */}
      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((day, i) => {
          const count = byDay[i].length
          return (
            <div key={i} className={`text-center text-xs py-1 rounded ${
              i === today ? 'bg-brand/20 text-brand font-medium' : 'text-gray-500'
            }`}>
              {day} <span className="text-gray-600">({count})</span>
            </div>
          )
        })}
      </div>

      {/* Today's classes expanded */}
      <div className="space-y-1.5">
        {byDay[today].length === 0 ? (
          <p className="text-xs text-gray-600 text-center py-2">No classes today</p>
        ) : (
          byDay[today].map(cls => (
            <button
              key={cls.id}
              onClick={() => {
                setSelectedClass(cls)
                setAttendanceDate(new Date().toISOString().split('T')[0])
              }}
              className={`w-full text-left border rounded-lg px-3 py-2 transition-colors hover:bg-gray-800/40 ${DAY_COLORS[today % DAY_COLORS.length]}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{cls.name}</span>
                <span className="text-xs opacity-70">{cls.start_time?.slice(0, 5)}</span>
              </div>
              <div className="text-xs opacity-60 mt-0.5">
                {cls.instructor?.full_name || 'No instructor'} · {cls.capacity} spots
                {cls.location && ` · ${cls.location}`}
              </div>
            </button>
          ))
        )}
      </div>

      {/* Other days summary */}
      <div className="space-y-1">
        {[1, 2, 3, 4, 5, 6, 0].filter(d => d !== today).map(d => {
          if (byDay[d].length === 0) return null
          return (
            <div key={d} className="text-xs text-gray-500 px-1">
              <span className="font-medium text-gray-400">{DAYS[d]}:</span>{' '}
              {byDay[d].map(c => c.name).join(', ')}
            </div>
          )
        })}
      </div>
    </div>
  )
}
