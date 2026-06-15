import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { dataconnect } from '../lib/firebase'
import { getOrgQueue, createQueueEntry, updateQueueStatus, deleteQueueEntry, getActiveServices } from '@bridgeway/database'
import { useToast } from '../context/ToastContext'
import { logActivity } from '../lib/logActivity'
import EmptyState from '../components/EmptyState'

export default function LiveQueue() {
  const { profile } = useAuth()
  const { showToast } = useToast()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [adding, setAdding] = useState(false)
  const orgId = profile?.org_id

  const loadQueue = useCallback(async () => {
    if (!orgId) return
    try {
      const { data } = await getOrgQueue(dataconnect, { orgId })
      const enriched = (data?.queueEntries || []).map((e: any) => ({
        id: e.id,
        client_name: e.clientName,
        joined_at: e.joinedAt,
        called_at: e.calledAt,
        completed_at: e.completedAt,
        status: e.status,
        position: e.position,
        notes: e.notes,
        client: e.client,
        service: e.service,
        staff: e.staff ? { full_name: e.staff.fullName } : null,
      }))
      setEntries(enriched)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [orgId])

  useEffect(() => {
    loadQueue()
  }, [loadQueue])

  // Polling for live queue updates instead of Supabase realtime channel
  useEffect(() => {
    if (!orgId) return
    const interval = setInterval(loadQueue, 5000)
    return () => clearInterval(interval)
  }, [orgId, loadQueue])

  // Load services for add form
  useEffect(() => {
    if (!orgId) return
    getActiveServices(dataconnect, { orgId })
      .then(({ data }) => setServices((data?.services || []) as any))
      .catch(() => setServices([]))
  }, [orgId])

  async function addToQueue(e) {
    e.preventDefault()
    if (!newName.trim()) return
    setAdding(true)
    try {
      // Get next position
      const maxPos = entries.reduce((max, e) => Math.max(max, e.position || 0), 0)
      await createQueueEntry(dataconnect, {
        orgId: orgId,
        clientName: newName.trim(),
        serviceId: selectedService || null,
        status: 'waiting',
        position: maxPos + 1,
      })

      setNewName('')
      setSelectedService('')
      setNewNotes('')
      setShowAdd(false)
      loadQueue()
      logActivity({ org_id: orgId, action: 'queue.added', entity_type: 'queue', metadata: { client_name: newName.trim() } })
      showToast('Added to queue', 'success')
    } catch (err: any) {
      showToast(err.message, 'error')
    } finally {
      setAdding(false)
    }
  }

  async function callNext(entryId) {
    try {
      await updateQueueStatus(dataconnect, {
        id: entryId,
        status: 'serving',
        calledAt: new Date().toISOString(),
      })
      loadQueue()
      showToast('Client called', 'success')
    } catch (err: any) {
      showToast(err.message, 'error')
    }
  }

  async function completeEntry(entryId) {
    try {
      await updateQueueStatus(dataconnect, {
        id: entryId,
        status: 'completed',
        completedAt: new Date().toISOString(),
      })
      loadQueue()
      showToast('Completed', 'success')
    } catch (err: any) {
      showToast(err.message, 'error')
    }
  }

  async function markNoShow(entryId) {
    try {
      await updateQueueStatus(dataconnect, {
        id: entryId,
        status: 'no_show',
      })
      loadQueue()
      showToast('Marked no show', 'success')
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

  const waiting = entries.filter(e => e.status === 'waiting')
  const serving = entries.filter(e => e.status === 'serving')

  return (
    <div className="space-y-3">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">{waiting.length} waiting</span>
          {serving.length > 0 && (
            <span className="text-sm text-brand">· {serving.length} serving</span>
          )}
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => setShowAdd(!showAdd)}
            className="text-xs bg-brand/20 text-brand hover:bg-brand/30 px-2 py-1 rounded transition-colors">
            + Add
          </button>
        </div>
      </div>

      {/* Add form */}
      {showAdd && (
        <form onSubmit={addToQueue} className="bg-gray-800/60 rounded-lg p-3 space-y-2">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Client name"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-600"
            autoFocus
          />
          <select
            value={selectedService}
            onChange={e => setSelectedService(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white"
          >
            <option value="">No service</option>
            {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <input
            type="text"
            value={newNotes}
            onChange={e => setNewNotes(e.target.value)}
            placeholder="Notes (optional)"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-600"
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowAdd(false)} className="text-xs text-gray-500 px-2 py-1">Cancel</button>
            <button type="submit" disabled={adding || !newName.trim()}
              className="text-xs bg-brand text-[#0c1a2e] font-medium px-3 py-1 rounded disabled:opacity-50">
              {adding ? 'Adding…' : 'Add to Queue'}
            </button>
          </div>
        </form>
      )}

      {/* Queue is empty */}
      {entries.length === 0 && !showAdd && (
        <EmptyState icon="users" title="Queue empty" message="Add walk-in clients to get started" />
      )}

      {/* Now serving */}
      {serving.length > 0 && (
        <div className="space-y-1">
          <div className="text-xs text-brand uppercase tracking-wider font-medium px-1">Now Serving</div>
          {serving.map(e => (
            <div key={e.id} className="bg-brand/10 border border-brand/20 rounded-lg px-3 py-2 flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <span className="text-sm text-white font-medium">{e.client_name}</span>
                {e.service?.name && <span className="ml-2 text-xs text-gray-400">{e.service.name}</span>}
                {e.staff?.full_name && <span className="ml-2 text-xs text-gray-500">with {e.staff.full_name}</span>}
              </div>
              <div className="flex gap-1 ml-2">
                <button onClick={() => completeEntry(e.id)}
                  className="text-xs bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 px-2 py-1 rounded transition-colors">
                  Done
                </button>
                <button onClick={() => markNoShow(e.id)}
                  className="text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 px-2 py-1 rounded transition-colors">
                  No Show
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Waiting list */}
      {waiting.length > 0 && (
        <div className="space-y-1">
          {serving.length > 0 && (
            <div className="text-xs text-gray-500 uppercase tracking-wider font-medium px-1">Waiting</div>
          )}
          {waiting.map((e, i) => {
            const waitTime = Math.round((Date.now() - new Date(e.joined_at).getTime()) / 60000)
            return (
              <div key={e.id} className="bg-gray-800/60 rounded-lg px-3 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-xs font-mono text-gray-600 w-4 text-right">{i + 1}</span>
                  <div className="min-w-0">
                    <span className="text-sm text-white">{e.client_name}</span>
                    {e.service?.name && <span className="ml-2 text-xs text-gray-500">{e.service.name}</span>}
                    <span className="ml-2 text-xs text-gray-600">{waitTime}m</span>
                  </div>
                </div>
                <div className="flex gap-1 ml-2">
                  <button onClick={() => callNext(e.id)}
                    className="text-xs bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 px-2 py-1 rounded transition-colors">
                    Call
                  </button>
                  <button onClick={() => deleteQueueEntry(dataconnect, { id: e.id }).then(() => loadQueue())}
                    className="text-xs text-gray-500 hover:text-gray-400 px-1 py-1">
                    ✕
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
