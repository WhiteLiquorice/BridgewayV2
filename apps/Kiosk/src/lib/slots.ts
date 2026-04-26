/**
 * Generate available appointment slots for a given date.
 * Excludes times already booked and times in the past.
 */
export function generateSlots(hoursStart, hoursEnd, durationMins, existingBookings, date) {
  const slots = []
  const [startH, startM] = hoursStart.split(':').map(Number)
  const [endH, endM]     = hoursEnd.split(':').map(Number)
  const now = new Date()

  let cur = new Date(date)
  cur.setHours(startH, startM, 0, 0)
  const end = new Date(date)
  end.setHours(endH, endM, 0, 0)

  while (cur < end) {
    const slotEnd = new Date(cur.getTime() + durationMins * 60000)
    if (slotEnd > end) break

    // Skip past times
    if (cur > now) {
      const overlaps = existingBookings.some(b => {
        const bStart = new Date(b.scheduled_at)
        const bEnd   = new Date(bStart.getTime() + (b.services?.duration_minutes || durationMins) * 60000)
        return cur < bEnd && slotEnd > bStart
      })
      if (!overlaps) {
        slots.push(new Date(cur))
      }
    }
    cur = new Date(cur.getTime() + durationMins * 60000)
  }
  return slots
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
