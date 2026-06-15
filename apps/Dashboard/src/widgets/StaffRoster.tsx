import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTerminology } from '../context/TerminologyContext'
import { dataconnect } from '../lib/firebase'
import { getOrgProfiles, getStaffShifts } from '@bridgeway/database'
import EmptyState from '../components/EmptyState'

const STATUS_OPTIONS = ['In Office', 'On Lunch', 'On Break', 'Out']

const statusStyles = {
  'In Office': 'bg-green-500/10 text-green-400 border-green-500/20',
  'On Lunch': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'On Break': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Out': 'bg-gray-500/10 text-gray-400 border-gray-700',
}

const roleLabels = {
  admin: 'Admin',
  manager: 'Manager',
  staff: 'Staff',
}

const LS_ROSTER_KEY = 'bw_staff_roster_status'

function loadStatuses() {
  try {
    return JSON.parse(localStorage.getItem(LS_ROSTER_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveStatuses(statuses) {
  localStorage.setItem(LS_ROSTER_KEY, JSON.stringify(statuses))
}

function fmtTime(t) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hr = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${hr}:${String(m).padStart(2, '0')} ${ampm}`
}

export default function StaffRoster() {
  const { terms } = useTerminology()
  const { profile } = useAuth()
  const [staffList, setStaffList] = useState([])
  const [todayShifts, setTodayShifts] = useState({})
  const [statuses, setStatuses] = useState(loadStatuses())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!profile?.org_id) return
    fetchStaff()
  }, [profile?.org_id])

  async function fetchStaff() {
    setLoading(true)
    setError(false)
    try {
      const today = new Date().toISOString().split('T')[0]

      const [profilesRes, shiftsRes] = await Promise.all([
        getOrgProfiles(dataconnect, { orgId: profile.org_id }),
        getStaffShifts(dataconnect, { orgId: profile.org_id, start: today, end: today })
      ])

      const list = (profilesRes.data?.profiles || [])
        .filter((p: any) => p.isActive && ['admin', 'manager', 'staff'].includes(p.role))
        .map((p: any) => ({
          id: p.id,
          full_name: p.fullName,
          role: p.role,
          email: p.email,
        }))
      setStaffList(list)

      // Build shift lookup by staff_id
      const shiftMap = {}
      ;(shiftsRes.data?.staffShifts || []).forEach((s: any) => {
        if (s.staff?.id) {
          shiftMap[s.staff.id] = {
            start_time: s.startTime,
            end_time: s.endTime,
          }
        }
      })
      setTodayShifts(shiftMap)
    } catch {
      setError(true)
      setStaffList([])
    } finally {
      setLoading(false)
    }
  }

  function handleStatusChange(profileId, newStatus) {
    const updated = { ...statuses, [profileId]: newStatus }
    setStatuses(updated)
    saveStatuses(updated)
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

  if (staffList.length === 0) {
    return <EmptyState icon="users" title={`No ${terms.staff.plural.toLowerCase()} profiles`} message={`${terms.staff.plural} will appear here once profiles are created.`} />
  }

  // Sort: scheduled today first, then unscheduled
  const sorted = [...staffList].sort((a, b) => {
    const aScheduled = !!todayShifts[a.id]
    const bScheduled = !!todayShifts[b.id]
    if (aScheduled && !bScheduled) return -1
    if (!aScheduled && bScheduled) return 1
    return 0
  })

  return (
    <div className="space-y-2">
      {sorted.map(member => {
        const currentStatus = statuses[member.id] || 'In Office'
        const shift = todayShifts[member.id]
        const isScheduled = !!shift

        return (
          <div
            key={member.id}
            className={`flex items-center justify-between gap-3 p-2.5 rounded-lg ${isScheduled ? 'bg-gray-800/50' : 'bg-gray-800/20 opacity-50'}`}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{member.full_name || member.email || '—'}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="inline-block text-xs px-1.5 py-0.5 rounded font-medium bg-gray-700/50 text-gray-400">
                  {roleLabels[member.role] || member.role}
                </span>
                {shift && (
                  <span className="text-[10px] text-gray-500">
                    {fmtTime(shift.start_time)} – {fmtTime(shift.end_time)}
                  </span>
                )}
                {!shift && (
                  <span className="text-[10px] text-gray-600 italic">Not scheduled</span>
                )}
              </div>
            </div>
            {isScheduled && (
              <select
                value={currentStatus}
                onChange={e => handleStatusChange(member.id, e.target.value)}
                className={`text-xs px-2 py-1 rounded-md border font-medium bg-transparent cursor-pointer focus:outline-none ${statusStyles[currentStatus]}`}
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt} value={opt} className="bg-gray-900 text-white">{opt}</option>
                ))}
              </select>
            )}
          </div>
        )
      })}
    </div>
  )
}
