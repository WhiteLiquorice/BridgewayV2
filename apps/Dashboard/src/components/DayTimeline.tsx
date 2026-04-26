import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { STATUS_LABELS, SERVICE_COLORS } from '../lib/appointmentStatus'

const HOUR_START = 7   // 7 AM
const HOUR_END   = 20  // 8 PM
const TOTAL_HOURS = HOUR_END - HOUR_START

export default function DayTimeline() {
  const { profile } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile?.org_id) return
    fetchToday()
  }, [profile?.org_id])

  async function fetchToday() {
    setLoading(true)
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString()

    try {
      const { data } = await supabase
        .from('appointments')
        .select('id, scheduled_at, duration_minutes, status, services(name), clients(name)')
        .eq('org_id', profile.org_id)
        .gte('scheduled_at', start)
        .lte('scheduled_at', end)
        .neq('status', 'cancelled')
        .order('scheduled_at')
      setAppointments(data || [])
    } catch {
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }

  // Current time marker position
  const now = new Date()
  const currentHour = now.getHours() + now.getMinutes() / 60
  const nowPercent = Math.max(0, Math.min(100, ((currentHour - HOUR_START) / TOTAL_HOURS) * 100))
  const isInRange = currentHour >= HOUR_START && currentHour <= HOUR_END

  // Service name → color mapping (stable via useMemo)
  const serviceColorMap = useMemo(() => {
    const map = {}
    let idx = 0
    appointments.forEach(a => {
      const svc = a.services?.name || 'Other'
      if (!map[svc]) {
        map[svc] = SERVICE_COLORS[idx % SERVICE_COLORS.length]
        idx++
      }
    })
    return map
  }, [appointments])

  // Hour labels
  const hours = []
  for (let h = HOUR_START; h <= HOUR_END; h++) {
    hours.push(h)
  }

  if (loading) {
    return (
      <div className="h-16 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center">
        <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
      {/* Hour labels */}
      <div className="relative h-5 mb-1">
        {hours.map(h => {
          const left = ((h - HOUR_START) / TOTAL_HOURS) * 100
          return (
            <span
              key={h}
              className="absolute text-[10px] text-gray-600 -translate-x-1/2"
              style={{ left: `${left}%` }}
            >
              {h > 12 ? `${h - 12}p` : h === 12 ? '12p' : `${h}a`}
            </span>
          )
        })}
      </div>

      {/* Timeline track */}
      <div className="relative h-8 bg-gray-800/50 rounded-lg overflow-hidden">
        {/* Hour grid lines */}
        {hours.map(h => {
          const left = ((h - HOUR_START) / TOTAL_HOURS) * 100
          return (
            <div
              key={h}
              className="absolute top-0 bottom-0 w-px bg-gray-800"
              style={{ left: `${left}%` }}
            />
          )
        })}

        {/* Appointment blocks */}
        {appointments.map((appt, i) => {
          const dt = new Date(appt.scheduled_at)
          const startHour = dt.getHours() + dt.getMinutes() / 60
          const durationHours = (appt.duration_minutes || 30) / 60
          const left = ((startHour - HOUR_START) / TOTAL_HOURS) * 100
          const width = (durationHours / TOTAL_HOURS) * 100
          const color = serviceColorMap[appt.services?.name || 'Other']

          return (
            <div
              key={appt.id}
              className="absolute top-1 bottom-1 rounded-md flex items-center px-1.5 overflow-hidden cursor-default group"
              style={{
                left: `${Math.max(0, left)}%`,
                width: `${Math.min(width, 100 - left)}%`,
                backgroundColor: `${color}20`,
                borderLeft: `2px solid ${color}`,
              }}
              title={`${appt.clients?.name || '—'} · ${appt.services?.name || '—'} · ${STATUS_LABELS[appt.status] || appt.status}`}
            >
              <span className="text-[10px] font-medium text-gray-300 truncate">
                {appt.clients?.name?.split(' ')[0] || '—'}
              </span>
            </div>
          )
        })}

        {/* Current time marker */}
        {isInRange && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
            style={{ left: `${nowPercent}%` }}
          >
            <div className="w-2 h-2 bg-red-500 rounded-full -translate-x-[3px] -translate-y-0.5" />
          </div>
        )}
      </div>

      {/* Legend (compact) */}
      {Object.keys(serviceColorMap).length > 0 && (
        <div className="flex flex-wrap gap-3 mt-2">
          {Object.entries(serviceColorMap).map(([name, color]) => (
            <div key={name} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[10px] text-gray-500">{name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
