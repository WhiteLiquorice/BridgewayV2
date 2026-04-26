import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  closestCenter,
} from '@dnd-kit/core'

// ── Draggable queue entry card ───────────────────────────────────────────────
function QueueCard({ entry, isDragging }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: entry.id })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-grab active:cursor-grabbing select-none transition-opacity ${
        isDragging
          ? 'opacity-40'
          : 'bg-gray-800 border-gray-700 hover:border-brand/40'
      }`}
    >
      <div className="w-7 h-7 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
        <span className="text-brand text-xs font-bold">
          {(entry.client_name || '?').charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-sm text-white font-medium truncate">{entry.client_name}</p>
        {entry.service?.name && (
          <p className="text-xs text-gray-500 truncate">{entry.service.name}</p>
        )}
      </div>
      <svg className="w-4 h-4 text-gray-600 ml-auto flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01" />
      </svg>
    </div>
  )
}

// ── Droppable zone ────────────────────────────────────────────────────────────
function ZoneCard({ zone, assignments, onClear }) {
  const { setNodeRef, isOver } = useDroppable({ id: zone.id })

  const occupied = assignments.filter(a => a.zone_id === zone.id && !a.cleared_at)

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border-2 transition-colors p-3 min-h-[90px] ${
        isOver
          ? 'border-brand bg-brand/5'
          : occupied.length > 0
          ? 'border-emerald-600/40 bg-emerald-500/5'
          : 'border-gray-700/60 bg-gray-800/30'
      }`}
    >
      {/* Zone label */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{zone.name}</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
          occupied.length >= (zone.capacity || 1)
            ? 'bg-red-500/20 text-red-400'
            : 'bg-gray-700 text-gray-500'
        }`}>
          {occupied.length}/{zone.capacity || 1}
        </span>
      </div>

      {/* Occupants */}
      {occupied.length > 0 ? (
        <div className="space-y-1">
          {occupied.map(a => (
            <div key={a.id} className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-400 text-[9px] font-bold">
                  {(a.client_name || '?').charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-white flex-1 truncate">{a.client_name}</span>
              <button
                onClick={() => onClear(a.id)}
                className="text-gray-600 hover:text-red-400 transition-colors"
                title="Clear seat"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className={`flex items-center justify-center h-8 transition-colors ${isOver ? 'text-brand' : 'text-gray-700'}`}>
          <span className="text-xs">{isOver ? 'Drop here' : 'Empty'}</span>
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TheFloor() {
  const { profile } = useAuth()
  const [zones, setZones] = useState([])
  const [queue, setQueue] = useState([])
  const [assignments, setAssignments] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeId, setActiveId] = useState(null) // drag overlay

  const orgId = profile?.org_id

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const loadAll = useCallback(async () => {
    if (!orgId) return
    try {
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
      const todayEnd   = new Date(); todayEnd.setHours(23, 59, 59, 999)

      const [zoneRes, queueRes, assignRes, apptRes] = await Promise.all([
        supabase.from('floor_zones').select('*').eq('org_id', orgId).order('name'),
        supabase.from('queue_entries')
          .select('id, client_name, status, joined_at, service:services!service_id(name)')
          .eq('org_id', orgId).in('status', ['waiting', 'serving']).order('position'),
        supabase.from('seat_assignments')
          .select('id, zone_id, zone_name, queue_entry_id, client_name, assigned_at')
          .eq('org_id', orgId).is('cleared_at', null),
        supabase.from('appointments')
          .select('id, scheduled_at, status, client:clients!client_id(name), service:services!service_id(name), staff:profiles!staff_id(full_name)')
          .eq('org_id', orgId)
          .gte('scheduled_at', todayStart.toISOString())
          .lte('scheduled_at', todayEnd.toISOString())
          .in('status', ['confirmed', 'arrived', 'with_provider'])
          .order('scheduled_at'),
      ])

      if (zoneRes.error) throw zoneRes.error
      setZones(zoneRes.data || [])
      setQueue(queueRes.data || [])
      setAssignments(assignRes.data || [])
      setAppointments(apptRes.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [orgId])

  useEffect(() => {
    loadAll()
    const interval = setInterval(loadAll, 30000)
    return () => clearInterval(interval)
  }, [loadAll])

  // Realtime
  useEffect(() => {
    if (!orgId) return
    const ch = supabase.channel('floor-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'queue_entries', filter: `org_id=eq.${orgId}` }, loadAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'seat_assignments', filter: `org_id=eq.${orgId}` }, loadAll)
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [orgId, loadAll])

  // ── Drag handlers ──────────────────────────────────────────────────────────
  function handleDragStart({ active }) {
    setActiveId(active.id)
  }

  async function handleDragEnd({ active, over }) {
    setActiveId(null)
    if (!over || !orgId) return

    const entry = queue.find(q => q.id === active.id)
    const zone  = zones.find(z => z.id === over.id)
    if (!entry || !zone) return

    // Prevent over-capacity
    const occupied = assignments.filter(a => a.zone_id === zone.id && !a.cleared_at)
    if (occupied.length >= (zone.capacity || 1)) return

    // Upsert seat assignment
    await supabase.from('seat_assignments').insert({
      org_id: orgId,
      zone_id: zone.id,
      zone_name: zone.name,
      queue_entry_id: entry.id,
      client_name: entry.client_name,
    })

    loadAll()
  }

  async function handleClearSeat(assignmentId) {
    await supabase.from('seat_assignments')
      .update({ cleared_at: new Date().toISOString() })
      .eq('id', assignmentId)
    loadAll()
  }

  // ── Active drag overlay card ───────────────────────────────────────────────
  const activeEntry = queue.find(q => q.id === activeId)

  // ── Fallback: no zones configured ─────────────────────────────────────────
  const hasZones = zones.length > 0

  if (loading) return (
    <div className="flex items-center justify-center h-32">
      <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (error) return <div className="text-sm text-red-400 p-4">{error}</div>

  const inProgress  = appointments.filter(a => a.status === 'with_provider')
  const arrived     = appointments.filter(a => a.status === 'arrived')
  const upcoming    = appointments.filter(a => a.status === 'confirmed')
  const queueWaiting= queue.filter(q => q.status === 'waiting')
  const queueServing= queue.filter(q => q.status === 'serving')

  // Unassigned queue entries (not in an active seat assignment)
  const assignedEntryIds = new Set(assignments.filter(a => !a.cleared_at).map(a => a.queue_entry_id))
  const unassignedQueue  = queue.filter(q => !assignedEntryIds.has(q.id))

  return (
    <div className="space-y-4">
      {/* Summary counters */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 text-center">
          <div className="text-xl font-bold text-emerald-400">{inProgress.length + queueServing.length}</div>
          <div className="text-xs text-gray-500">In Session</div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2 text-center">
          <div className="text-xl font-bold text-blue-400">{arrived.length}</div>
          <div className="text-xs text-gray-500">Arrived</div>
        </div>
        <div className="bg-brand/10 border border-brand/20 rounded-lg px-3 py-2 text-center">
          <div className="text-xl font-bold text-brand">{queueWaiting.length}</div>
          <div className="text-xs text-gray-500">In Queue</div>
        </div>
        <div className="bg-gray-700/50 border border-gray-700 rounded-lg px-3 py-2 text-center">
          <div className="text-xl font-bold text-gray-300">{upcoming.length}</div>
          <div className="text-xs text-gray-500">Upcoming</div>
        </div>
      </div>

      {hasZones ? (
        /* ── Spatial drag-and-drop floor view ─────────────────────────────── */
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-3">
            {/* Zones grid */}
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2 px-0.5">Floor Zones</div>
              <div className="grid grid-cols-2 gap-2">
                {zones.map(zone => (
                  <ZoneCard
                    key={zone.id}
                    zone={zone}
                    assignments={assignments}
                    onClear={handleClearSeat}
                  />
                ))}
              </div>
            </div>

            {/* Unassigned queue */}
            {unassignedQueue.length > 0 && (
              <div>
                <div className="text-xs text-brand uppercase tracking-wider font-medium mb-2 px-0.5">
                  Queue — drag to assign a seat
                </div>
                <div className="space-y-1">
                  {unassignedQueue.map(entry => (
                    <QueueCard
                      key={entry.id}
                      entry={entry}
                      isDragging={entry.id === activeId}
                    />
                  ))}
                </div>
              </div>
            )}

            {unassignedQueue.length === 0 && zones.length > 0 && queue.length === 0 && (
              <div className="text-center py-3">
                <div className="text-gray-600 text-sm">No active queue entries</div>
              </div>
            )}
          </div>

          {/* Drag overlay */}
          <DragOverlay>
            {activeEntry ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-gray-800 border-brand shadow-xl shadow-black/50 cursor-grabbing">
                <div className="w-7 h-7 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-brand text-xs font-bold">
                    {(activeEntry.client_name || '?').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-white font-medium">{activeEntry.client_name}</p>
                  {activeEntry.service?.name && <p className="text-xs text-gray-500">{activeEntry.service.name}</p>}
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        /* ── List view fallback when no zones are configured ──────────────── */
        <div className="space-y-3">
          {(inProgress.length > 0 || queueServing.length > 0) && (
            <div>
              <div className="text-xs text-emerald-400 uppercase tracking-wider font-medium mb-1.5 px-1">In Session</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                {inProgress.map(a => (
                  <div key={a.id} className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                    <div className="text-sm text-white font-medium">{a.client?.name || 'Client'}</div>
                    <div className="text-xs text-gray-400">
                      {a.service?.name} · {a.staff?.full_name || 'No staff'}
                      <span className="ml-1 text-gray-600">
                        {new Date(a.scheduled_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                {queueServing.map(q => (
                  <div key={q.id} className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                    <div className="text-sm text-white font-medium">{q.client_name}</div>
                    <div className="text-xs text-gray-400">
                      {q.service?.name || 'Walk-in'}
                      <span className="ml-1 text-xs bg-brand/20 text-brand px-1 rounded">Queue</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {arrived.length > 0 && (
            <div>
              <div className="text-xs text-blue-400 uppercase tracking-wider font-medium mb-1.5 px-1">Checked In</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                {arrived.map(a => (
                  <div key={a.id} className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2">
                    <div className="text-sm text-white">{a.client?.name || 'Client'}</div>
                    <div className="text-xs text-gray-500">
                      {a.service?.name} · {new Date(a.scheduled_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {queueWaiting.length > 0 && (
            <div>
              <div className="text-xs text-brand uppercase tracking-wider font-medium mb-1.5 px-1">Queue</div>
              <div className="space-y-1">
                {queueWaiting.map((q, i) => {
                  const waitMin = Math.round((Date.now() - new Date(q.joined_at).getTime()) / 60000)
                  return (
                    <div key={q.id} className="flex items-center gap-2 text-sm px-1">
                      <span className="text-xs font-mono text-gray-600 w-4 text-right">{i + 1}</span>
                      <span className="text-white">{q.client_name}</span>
                      {q.service?.name && <span className="text-gray-500 text-xs">{q.service.name}</span>}
                      <span className="text-gray-600 text-xs ml-auto">{waitMin}m</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {inProgress.length === 0 && arrived.length === 0 && queueWaiting.length === 0 && queueServing.length === 0 && (
            <div className="text-center py-4">
              <div className="text-gray-600 text-sm">No active sessions</div>
              <div className="text-gray-700 text-xs mt-1">Configure floor zones in Admin → Org Setup to enable seat assignments</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
