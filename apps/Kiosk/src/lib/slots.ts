/**
 * Kiosk slot utilities — re-exports smart scheduling from shared package
 * and provides kiosk-specific helpers.
 */
import { generateSlots as generateSmartSlots } from '@bridgeway/scheduling'

/**
 * Generate available appointment slots for a given date.
 * Now uses the shared smart scheduling engine for gap management.
 */
export function generateSlots(hoursStart, hoursEnd, durationMins, existingBookings, date) {
  const dateStr = typeof date === 'string' ? date : toLocalDateString(date)
  const results = generateSmartSlots(
    hoursStart,
    hoursEnd,
    durationMins,
    existingBookings,
    [],
    dateStr,
    0, // Kiosk is in-person, no lead time needed
    { smartGapEnabled: true, minGapMinutes: 30, slotInterval: 15 }
  )
  // Kiosk consumers expect plain Date objects — map to match legacy interface
  return results.map(r => r.time)
}

export function formatTime(date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

/** Returns array of next N date strings (YYYY-MM-DD), starting today */
export function getUpcomingDates(n = 14) {
  const dates = []
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  for (let i = 0; i < n; i++) {
    const day = d.getDay()
    if (day !== 0) { // skip Sundays
      dates.push(d.toISOString().slice(0, 10))
    }
    d.setDate(d.getDate() + 1)
    if (dates.length >= n) break
  }
  return dates.slice(0, n)
}

export function toLocalDateString(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
