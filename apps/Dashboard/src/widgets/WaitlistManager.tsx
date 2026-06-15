import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { dataconnect } from '../lib/firebase'
import { getOrgWaitlist, updateClassRegistrationStatus } from '@bridgeway/database'
import { useToast } from '../context/ToastContext'
import EmptyState from '../components/EmptyState'

export default function WaitlistManager() {
  const { profile } = useAuth()
  const { showToast } = useToast()
  const [waitlisted, setWaitlisted] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const orgId = profile?.org_id

  useEffect(() => {
    if (!orgId) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const { data } = await getOrgWaitlist(dataconnect, { orgId })
        const list = (data?.classRegistrations || []).map((w: any) => ({
          id: w.id,
          classDate: w.classDate,
          status: w.status,
          createdAt: w.createdAt,
          client: w.client ? { name: w.client.name, email: w.client.email, phone: w.client.phone } : null,
          classEntity: w.classEntity ? { name: w.classEntity.name, dayOfWeek: w.classEntity.dayOfWeek, startTime: w.classEntity.startTime, capacity: w.classEntity.capacity } : null,
        }))
        if (!cancelled) setWaitlisted(list)
      } catch (err: any) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [orgId])

  async function promoteToRegistered(regId) {
    try {
      await updateClassRegistrationStatus(dataconnect, { id: regId, status: 'registered' })
      setWaitlisted(prev => prev.filter(w => w.id !== regId))
      showToast('Client promoted from waitlist', 'success')
    } catch (err: any) {
      showToast(err.message, 'error')
    }
  }

  async function removeFromWaitlist(regId) {
    try {
      await updateClassRegistrationStatus(dataconnect, { id: regId, status: 'cancelled' })
      setWaitlisted(prev => prev.filter(w => w.id !== regId))
      showToast('Removed from waitlist', 'success')
    } catch (err: any) {
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

  if (waitlisted.length === 0) {
    return <EmptyState icon="users" title="No waitlist" message="No clients are currently waitlisted for any class" />
  }

  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="space-y-2 max-h-72 overflow-y-auto">
      {waitlisted.map(w => (
        <div key={w.id} className="bg-gray-800/60 rounded-lg px-3 py-2.5">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <div className="text-sm text-white font-medium truncate">{w.client?.name || 'Unknown'}</div>
              <div className="text-xs text-gray-500 mt-0.5">
                {w.classEntity?.name || 'Unknown class'} · {w.classEntity?.dayOfWeek != null ? DAYS[w.classEntity.dayOfWeek] : ''} {w.classEntity?.startTime?.slice(0, 5) || ''}
              </div>
              <div className="text-xs text-gray-600 mt-0.5">
                for {w.classDate}
              </div>
            </div>
            <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
              <button
                onClick={() => promoteToRegistered(w.id)}
                className="text-xs bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 px-2 py-1 rounded transition-colors"
              >
                Promote
              </button>
              <button
                onClick={() => removeFromWaitlist(w.id)}
                className="text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 px-2 py-1 rounded transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
