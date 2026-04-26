// Centralized appointment status constants, flow logic, and display styles.
// Import this instead of defining local statusStyles objects.

export const STATUS_ORDER = ['pending', 'confirmed', 'arrived', 'with_provider', 'completed']

export const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  arrived: 'Arrived',
  with_provider: 'With Provider',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export const STATUS_STYLES = {
  pending:       'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  confirmed:     'bg-blue-500/10 text-blue-400 border-blue-500/20',
  arrived:       'bg-purple-500/10 text-purple-400 border-purple-500/20',
  with_provider: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  completed:     'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled:     'bg-red-500/10 text-red-400 border-red-500/20',
}

// Button label shown for the NEXT status transition
export const NEXT_ACTION_LABELS = {
  pending:       'Confirm',
  confirmed:     'Check In',
  arrived:       'Start Visit',
  with_provider: 'Complete',
}

// Button styles for the action button (distinct from badge styles)
export const NEXT_ACTION_STYLES = {
  pending:       'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20',
  confirmed:     'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20',
  arrived:       'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20',
  with_provider: 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20',
}

// Service-type colors for the day timeline
export const SERVICE_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#ec4899', // pink
  '#6366f1', // indigo
]

export function getNextStatus(current) {
  const idx = STATUS_ORDER.indexOf(current)
  if (idx === -1 || idx >= STATUS_ORDER.length - 1) return null
  return STATUS_ORDER[idx + 1]
}

export function getStatusStyle(status) {
  return STATUS_STYLES[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'
}
