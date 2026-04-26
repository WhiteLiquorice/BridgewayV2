import { useEffect, useState } from 'react'
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useWidgetConfig } from './useWidgetConfig'
import { WIDGETS, canRoleSeeWidget } from './registry'
import WidgetCard from './WidgetCard'
import WidgetErrorBoundary from './WidgetErrorBoundary'
import TodaySchedule from './TodaySchedule'
import UnconfirmedAppointments from './UnconfirmedAppointments'
import WaitingRoomQueue from './WaitingRoomQueue'
import QuickClientLookup from './QuickClientLookup'
import StaffRoster from './StaffRoster'
import Announcements from './Announcements'
import Clock from './Clock'
import Revenue from './Revenue'
import UpcomingBookings from './UpcomingBookings'
import ClassSchedule from './ClassSchedule'
import WaitlistManager from './WaitlistManager'
import LiveQueue from './LiveQueue'
import TheFloor from './TheFloor'
import ClientRetention from './ClientRetention'
import PackageTracker from './PackageTracker'

const WIDGET_COMPONENTS = {
  todaySchedule: TodaySchedule,
  unconfirmedAppointments: UnconfirmedAppointments,
  waitingRoom: WaitingRoomQueue,
  quickLookup: QuickClientLookup,
  staffRoster: StaffRoster,
  announcements: Announcements,
  clock: Clock,
  revenue: Revenue,
  upcomingBookings: UpcomingBookings,
  classSchedule: ClassSchedule,
  waitlistManager: WaitlistManager,
  liveQueue: LiveQueue,
  theFloor: TheFloor,
  clientRetention: ClientRetention,
  packageTracker: PackageTracker,
}

function SortableWidget({ id, children, colSpan }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : undefined,
  }
  return (
    <div ref={setNodeRef} style={style} {...attributes}
         className={colSpan === 2 ? 'lg:col-span-2' : ''}>
      {/* Pass drag handle listeners to child via prop */}
      {typeof children === 'function' ? children(listeners) : children}
    </div>
  )
}

export default function WidgetCanvas() {
  const { user, profile } = useAuth()
  const role = profile?.role ?? 'staff'
  // Pass user?.id (stable string) rather than the user object so that token
  // refreshes — which create a new user object reference — don't re-fire the
  // useWidgetConfig effect and force all widgets into a full remount cycle.
  const { config, loading, reorder, toggleHidden, isHidden, getWidth, getHeight, setWidth, setHeight } = useWidgetConfig(user?.id, role)
  const [editMode, setEditMode] = useState(false)
  const [disabledWidgets, setDisabledWidgets] = useState([])

  // Fetch org-level disabled widgets list. Admins can hide widgets org-wide
  // via the Admin app's Org Setup page; those IDs are persisted to
  // org_settings.disabled_widgets (text[]) and filtered out here.
  useEffect(() => {
    const orgId = profile?.org_id
    if (!orgId) return
    let cancelled = false
    ;(async () => {
      const { data } = await supabase
        .from('org_settings')
        .select('disabled_widgets')
        .eq('org_id', orgId)
        .maybeSingle()
      if (!cancelled && data?.disabled_widgets) {
        setDisabledWidgets(data.disabled_widgets)
      }
    })()
    return () => { cancelled = true }
  }, [profile?.org_id])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  if (loading || !config) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // In normal mode: show only visible widgets the role can see
  // In edit mode: show all widgets this role can see (with show/hide controls)
  const displayOrder = (config.order || []).filter(
    id => canRoleSeeWidget(id, role) && !disabledWidgets.includes(id)
  )

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = displayOrder.indexOf(active.id)
    const newIndex = displayOrder.indexOf(over.id)
    if (oldIndex === -1 || newIndex === -1) return
    reorder(arrayMove(displayOrder, oldIndex, newIndex))
  }

  return (
    <div className="p-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white">Dashboard</h1>
          <p className="text-sm text-white/30 mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => setEditMode(e => !e)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
            editMode
              ? 'bg-brand text-white'
              : 'bg-white/[0.07] border border-white/[0.10] text-white/50 hover:text-white hover:bg-white/[0.12]'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          {editMode ? 'Done' : 'Edit Layout'}
        </button>
      </div>

      {editMode && (
        <div className="mb-4 bg-brand/10 border border-brand/20 rounded-xl px-4 py-3 text-sm text-brand">
          Drag ⠿ to reorder · Drag right edge ↔ for width · Drag bottom edge ↕ for height · Hide/Show to toggle visibility
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={displayOrder} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {displayOrder.map(widgetId => {
              const WidgetComponent = WIDGET_COMPONENTS[widgetId]
              if (!WidgetComponent) return null
              const hidden = isHidden(widgetId)
              // In normal mode, skip hidden widgets
              if (!editMode && hidden) return null

              const isLarge = getWidth(widgetId) === 'large'
              const currentHeight = getHeight(widgetId)
              return (
                <SortableWidget key={widgetId} id={widgetId} colSpan={isLarge ? 2 : 1}>
                  {(dragHandleProps) => (
                    <WidgetCard
                      title={WIDGETS.find(w => w.id === widgetId)?.label || widgetId}
                      dragHandleProps={dragHandleProps}
                      editMode={editMode}
                      widgetId={widgetId}
                      onToggleHide={toggleHidden}
                      onSetWidth={setWidth}
                      onSetHeight={setHeight}
                      hidden={hidden}
                      isLarge={isLarge}
                      currentHeight={currentHeight}
                    >
                      {!hidden && (
                        <WidgetErrorBoundary key={widgetId + '-boundary'}>
                          <WidgetComponent />
                        </WidgetErrorBoundary>
                      )}
                      {hidden && editMode && (
                        <p className="text-gray-600 text-sm text-center py-4">Widget hidden</p>
                      )}
                    </WidgetCard>
                  )}
                </SortableWidget>
              )
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
