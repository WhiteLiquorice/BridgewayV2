// Widget registry — defines all widgets, their display names, and role permissions.
// Add new widgets here — WidgetCanvas reads this list automatically.
export const WIDGETS = [
  {
    id: 'todaySchedule',
    label: "Today's Schedule",
    description: "Today's appointments in time order",
    defaultOn: true,
    roles: ['admin', 'manager', 'staff'],  // all staff roles
  },
  {
    id: 'unconfirmedAppointments',
    label: 'Unconfirmed Appointments',
    description: 'Next 48 hours without confirmed status',
    defaultOn: true,
    roles: ['admin', 'manager', 'staff'],
  },
  {
    id: 'waitingRoom',
    label: 'Waiting Room',
    description: 'Manual queue for walk-ins and arrived patients',
    defaultOn: true,
    roles: ['admin', 'manager', 'staff'],
  },
  {
    id: 'quickLookup',
    label: 'Quick Client Lookup',
    description: 'Search clients without leaving the dashboard',
    defaultOn: true,
    roles: ['admin', 'manager', 'staff'],
  },
  {
    id: 'clock',
    label: 'Clock',
    description: 'Current time and date',
    defaultOn: true,
    roles: ['admin', 'manager', 'staff'],
  },
  {
    id: 'announcements',
    label: 'Announcements',
    description: "Today's office notes from manager",
    defaultOn: true,
    roles: ['admin', 'manager', 'staff'],
  },
  {
    id: 'staffRoster',
    label: 'Staff Roster',
    description: 'Who is in today and their status',
    defaultOn: true,
    roles: ['admin', 'manager', 'staff'],
  },
  {
    id: 'revenue',
    label: 'Revenue',
    description: "Today's revenue vs daily target",
    defaultOn: true,
    // ROLE-RESTRICTED: hidden from staff by default — enforced in useWidgetConfig
    roles: ['admin', 'manager'],
  },
  {
    id: 'upcomingBookings',
    label: 'Upcoming Bookings',
    description: 'New public booking requests to confirm',
    defaultOn: true,
    roles: ['admin', 'manager', 'staff'],
  },
  {
    id: 'classSchedule',
    label: 'Class Schedule',
    description: 'Weekly class grid with attendance tracking',
    defaultOn: true,
    roles: ['admin', 'manager', 'staff'],
  },
  {
    id: 'waitlistManager',
    label: 'Waitlist Manager',
    description: 'Clients waiting for spots in full classes',
    defaultOn: true,
    roles: ['admin', 'manager', 'staff'],
  },
  {
    id: 'liveQueue',
    label: 'Live Queue',
    description: 'Real-time walk-in queue with call and complete actions',
    defaultOn: true,
    roles: ['admin', 'manager', 'staff'],
  },
  {
    id: 'theFloor',
    label: 'The Floor',
    description: 'Real-time ops overview of appointments, classes, and queue',
    defaultOn: true,
    roles: ['admin', 'manager', 'staff'],
  },
  {
    id: 'clientRetention',
    label: 'Client Retention',
    description: 'Win-back targets, birthdays, and top clients',
    defaultOn: true,
    roles: ['admin', 'manager'],
  },
  {
    id: 'packageTracker',
    label: 'Package Tracker',
    description: 'Active client packages and remaining sessions',
    defaultOn: true,
    roles: ['admin', 'manager', 'staff'],
  },
]

export const WIDGET_IDS = WIDGETS.map(w => w.id)

// Returns whether a role can see a given widget
export function canRoleSeeWidget(widgetId, role) {
  const widget = WIDGETS.find(w => w.id === widgetId)
  if (!widget) return false
  return widget.roles.includes(role)
}
