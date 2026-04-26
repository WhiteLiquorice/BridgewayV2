import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useToast } from '../context/ToastContext'
import EmptyState from '../components/EmptyState'

export default function Queue() {
  const { profile } = useAuth()
  const { showToast } = useToast()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [services, setServices] = useState([])
  const [staff, setStaff] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newService, setNewService] = useState('')
  const [newStaff, setNewStaff] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [adding, setAdding] = useState(false)
  const [historyMode, setHistoryMode] = useState(false)
  const [history, setHistory] = useState([])

  const orgId = profile?.org_id

  const loadQueue = useCallback(async () => {
    if (!orgId) return
    try {
      const { data, error } = await supabase
        .from('queue_entries')
        .select('*, client:clients!client_id(name, phone), service:services!service_id(name), staff:profiles!staff_id(full_name)')
        .eq('org_id', orgId)
        .in('status', ['waiting', 'serving'])
        .order('position')
        .order('joined_at')

      if (error) throw error
      setEntries(data || [])
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }, [orgId])

  useEffect(() => {
    loadQueue()
    supabase.from('services').select('id, name').eq('org_id', orgId).eq('is_archived', false).order('name')
      .then(({ data }) => setServices(data || []))
    supabase.from('profiles').select('id, full_name').eq('org_id', orgId).eq('is_active', true)
      .in('role', ['admin', 'manager', 'staff']).order('full_name')
      .then(({ data }) => setStaff(data || []))
  }, [loadQueue, orgId])

  // Realtime
  useEffect(() => {
    if (!orgId) return
    const channel = supabase
      .channel('queue-page-realtime')
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'queue_entries',
        filter: `org_id=eq.${orgId}`,
      }, () => loadQueue())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [orgId, loadQueue])

  async function loadHistory() {
    if (!orgId) return
    try {
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)

      const { data, error } = await supabase
        .from('queue_entries')
        .select('*, client:clients!client_id(name), service:services!service_id(name), staff:profiles!staff_id(full_name)')
        .eq('org_id', orgId)
        .in('status', ['completed', 'no_show'])
        .gte('joined_at', todayStart.toISOString())
        .order('completed_at', { ascending: false })

      if (error) throw error
      setHistory(data || [])
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  async function addToQueue(e) {
    e.preventDefault()
    if (!newName.trim()) return
    setAdding(true)
    try {
      const maxPos = entries.reduce((max, e) => Math.max(max, e.position || 0), 0)
      const { error } = await supabase
        .from('queue_entries')
        .insert({
          org_id: orgId,
          client_name: newName.trim(),
          service_id: newService || null,
          staff_id: newStaff || null,
          notes: newNotes.trim() || null,
          position: maxPos + 1,
        })

      if (error) throw error
      setNewName('')
      setNewService('')
      setNewStaff('')
      setNewNotes('')
      setShowAdd(false)
      showToast('Added to queue', 'success')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setAdding(false)
    }
  }

  async function callEntry(id) {
    try {
      const { error } = await supabase.from('queue_entries')
        .update({ status: 'serving', called_at: new Date().toISOString() }).eq('id', id)
      if (error) throw error
      showToast('Client called', 'success')
    } catch (err) { showToast(err.message, 'error') }
  }

  async function completeEntry(id) {
    try {
      const { error } = await supabase.from('queue_entries')
        .update({ status: 'completed', completed_at: new Date().toISOString() }).eq('id', id)
      if (error) throw error
      showToast('Completed', 'success')
    } catch (err) { showToast(err.message, 'error') }
  }

  async function markNoShow(id) {
    try {
      const { error } = await supabase.from('queue_entries')
        .update({ status: 'no_show' }).eq('id', id)
      if (error) throw error
      showToast('Marked no show', 'success')
    } catch (err) { showToast(err.message, 'error') }
  }

  async function assignStaff(entryId, staffId) {
    try {
      const { error } = await supabase.from('queue_entries')
        .update({ staff_id: staffId || null }).eq('id', entryId)
      if (error) throw error
      showToast('Staff assigned', 'success')
    } catch (err) { showToast(err.message, 'error') }
  }

  const waiting = entries.filter(e => e.status === 'waiting')
  const serving = entries.filter(e => e.status === 'serving')

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Queue</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage walk-in clients and live queue</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setHistoryMode(!historyMode); if (!historyMode) loadHistory() }}
            className={`text-sm px-3 py-2 rounded-lg border transition-colors ${
              historyMode
                ? 'border-brand/30 bg-brand/10 text-brand'
                : 'border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800'
            }`}>
            {historyMode ? 'Live Queue' : 'History'}
          </button>
          <button onClick={() => setShowAdd(true)}
            className="bg-brand hover:bg-brand text-[#0c1a2e] font-medium text-sm px-4 py-2 rounded-lg transition-colors">
            + Add to Queue
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl px-4 py-3">
          <div className="text-2xl font-bold text-white">{waiting.length}</div>
          <div className="text-xs text-gray-500">Waiting</div>
        </div>
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl px-4 py-3">
          <div className="text-2xl font-bold text-brand">{serving.length}</div>
          <div className="text-xs text-gray-500">Being Served</div>
        </div>
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl px-4 py-3">
          <div className="text-2xl font-bold text-gray-400">
            {waiting.length > 0
              ? `~${Math.round(waiting.reduce((sum, e) => sum + (Date.now() - new Date(e.joined_at).getTime()), 0) / waiting.length / 60000)}m`
              : '—'
            }
          </div>
          <div className="text-xs text-gray-500">Avg Wait</div>
        </div>
      </div>

      {historyMode ? (
        // History view
        <div className="bg-gray-900/80 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-800">
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Staff</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Wait Time</th>
              </tr>
            </thead>
            <tbody>
              {history.map(e => {
                const waitMs = e.called_at ? new Date(e.called_at) - new Date(e.joined_at) : 0
                return (
                  <tr key={e.id} className="border-b border-gray-800/50">
                    <td className="px-4 py-3 text-white">{e.client_name}</td>
                    <td className="px-4 py-3 text-gray-400">{e.service?.name || '—'}</td>
                    <td className="px-4 py-3 text-gray-400">{e.staff?.full_name || '—'}</td>
                    <td className="px-4 py-3 text-gray-400">
                      {new Date(e.joined_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        e.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}>{e.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{waitMs > 0 ? `${Math.round(waitMs / 60000)}m` : '—'}</td>
                  </tr>
                )
              })}
              {history.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-600">No completed entries today</td></tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        // Live queue view
        <>
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
            </div>
          ) : entries.length === 0 && !showAdd ? (
            <EmptyState icon="users" title="Queue empty" message="Add walk-in clients to get started"
              ctaLabel="+ Add to Queue" onCta={() => setShowAdd(true)} />
          ) : (
            <div className="space-y-4">
              {/* Now serving */}
              {serving.length > 0 && (
                <div>
                  <h2 className="text-sm text-brand font-medium mb-2">Now Serving</h2>
                  <div className="space-y-2">
                    {serving.map(e => (
                      <div key={e.id} className="bg-brand/10 border border-brand/20 rounded-xl px-4 py-3 flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">{e.client_name}</div>
                          <div className="text-xs text-gray-400">
                            {e.service?.name || 'No service'}
                            {e.staff?.full_name && ` · ${e.staff.full_name}`}
                            {e.notes && ` · ${e.notes}`}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <select value={e.staff_id || ''} onChange={ev => assignStaff(e.id, ev.target.value)}
                            className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-xs text-white">
                            <option value="">Assign staff</option>
                            {staff.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
                          </select>
                          <button onClick={() => completeEntry(e.id)}
                            className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 px-3 py-1.5 rounded-lg text-sm transition-colors">
                            Complete
                          </button>
                          <button onClick={() => markNoShow(e.id)}
                            className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1.5 rounded-lg text-sm transition-colors">
                            No Show
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Waiting */}
              {waiting.length > 0 && (
                <div>
                  <h2 className="text-sm text-gray-400 font-medium mb-2">Waiting ({waiting.length})</h2>
                  <div className="space-y-2">
                    {waiting.map((e, i) => {
                      const waitMin = Math.round((Date.now() - new Date(e.joined_at).getTime()) / 60000)
                      return (
                        <div key={e.id} className="bg-gray-900/80 border border-gray-800 rounded-xl px-4 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-mono text-gray-600 w-6 text-right">{i + 1}</span>
                            <div>
                              <div className="text-white">{e.client_name}</div>
                              <div className="text-xs text-gray-500">
                                {e.service?.name || 'No service'}
                                {e.notes && ` · ${e.notes}`}
                                <span className="ml-2 text-gray-600">{waitMin}m wait</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => callEntry(e.id)}
                              className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 px-3 py-1.5 rounded-lg text-sm transition-colors">
                              Call
                            </button>
                            <button onClick={() => markNoShow(e.id)}
                              className="text-xs text-gray-500 hover:text-red-400 px-2 py-1.5 transition-colors">
                              Remove
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Add to queue form */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowAdd(false)}>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-white mb-4">Add to Queue</h2>
            <form onSubmit={addToQueue} className="space-y-3">
              <input type="text" value={newName} onChange={e => setNewName(e.target.value)}
                placeholder="Client name *" required autoFocus
                className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600" />
              <select value={newService} onChange={e => setNewService(e.target.value)}
                className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white">
                <option value="">No service</option>
                {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <select value={newStaff} onChange={e => setNewStaff(e.target.value)}
                className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white">
                <option value="">No staff preference</option>
                {staff.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
              </select>
              <input type="text" value={newNotes} onChange={e => setNewNotes(e.target.value)}
                placeholder="Notes (optional)"
                className="w-full bg-[#0c1a2e] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600" />
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="text-sm text-gray-400 px-4 py-2">Cancel</button>
                <button type="submit" disabled={adding || !newName.trim()}
                  className="bg-brand hover:bg-brand text-[#0c1a2e] font-medium text-sm px-4 py-2 rounded-lg disabled:opacity-50">
                  {adding ? 'Adding…' : 'Add to Queue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
