/**
 * Smart Scheduling Engine
 * 
 * Deterministic, rule-based slot generation with intelligent gap management.
 * Prevents unbookable time slivers by scoring slots based on how well they
 * pack the provider's calendar. No AI, no external APIs — pure calendar math.
 * 
 * Key behaviors:
 * - Hides slots that would create gaps shorter than `minGapMinutes`
 * - Scores remaining slots by adjacency to existing bookings and day boundaries
 * - Tags top-scoring slots as "recommended" so the UI can highlight them
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BookedRange {
  start: Date
  end: Date
}

export interface SlotResult {
  time: Date
  /** 0-100 score — higher means the slot packs the calendar more tightly */
  score: number
  /** True if the slot is in the top tier of scores (highlighted in UI) */
  recommended: boolean
  /** Human-readable reason the slot was recommended */
  recommendReason?: string
}

export interface SmartSlotOptions {
  /** Business hours start, e.g. "09:00" */
  hoursStart: string
  /** Business hours end, e.g. "17:00" */
  hoursEnd: string
  /** Duration of the service being booked, in minutes */
  serviceDuration: number
  /** Existing bookings / appointments for that day */
  existingBookings: BookedRange[]
  /** The selected date in "YYYY-MM-DD" format */
  selectedDate: string
  /** Minimum lead time before a slot can be booked, in hours (default: 2) */
  leadTimeHours?: number
  /** Slot interval in minutes — how often slots appear (default: 15) */
  slotInterval?: number

  // ── Smart Gap Config ──────────────────────────────────────────────────────
  /** Enable smart gap filling (default: true) */
  smartGapEnabled?: boolean
  /**
   * The minimum usable gap in minutes. Slots that would leave a gap
   * shorter than this between themselves and the nearest booking will
   * be hidden entirely. (default: 30)
   */
  minGapMinutes?: number
  /**
   * How many of the best-scoring slots to tag as "recommended".
   * If set to 0, no slots are recommended. (default: 3)
   */
  maxRecommended?: number
}

// ─── Core Algorithm ───────────────────────────────────────────────────────────

/**
 * Generate available time slots for a given day with smart gap management.
 */
export function generateSmartSlots(options: SmartSlotOptions): SlotResult[] {
  const {
    hoursStart,
    hoursEnd,
    serviceDuration,
    existingBookings,
    selectedDate,
    leadTimeHours = 2,
    slotInterval = 15,
    smartGapEnabled = true,
    minGapMinutes = 30,
    maxRecommended = 3,
  } = options

  const [startH, startM] = hoursStart.split(':').map(Number)
  const [endH, endM] = hoursEnd.split(':').map(Number)
  const [year, month, day] = selectedDate.split('-').map(Number)

  const dayStartMinutes = startH * 60 + startM
  const dayEndMinutes = endH * 60 + endM
  const nowPlusLead = new Date(Date.now() + leadTimeHours * 60 * 60 * 1000)

  // Normalize booked ranges and sort by start time
  const bookedRanges: BookedRange[] = [...existingBookings]
    .sort((a, b) => a.start.getTime() - b.start.getTime())

  const slots: SlotResult[] = []

  let curMinutes = dayStartMinutes

  while (curMinutes + serviceDuration <= dayEndMinutes) {
    const slotStart = new Date(year, month - 1, day, Math.floor(curMinutes / 60), curMinutes % 60)
    const slotEnd = new Date(slotStart.getTime() + serviceDuration * 60 * 1000)

    curMinutes += slotInterval

    // Skip if slot is in the past (+ lead time)
    if (slotStart <= nowPlusLead) continue

    // Skip if slot conflicts with any existing booking
    const hasConflict = bookedRanges.some(b => slotStart < b.end && slotEnd > b.start)
    if (hasConflict) continue

    // ── Smart Gap Check ───────────────────────────────────────────────────
    if (smartGapEnabled) {
      const gapInfo = analyzeGaps(slotStart, slotEnd, bookedRanges, dayStartMinutes, dayEndMinutes, year, month - 1, day)

      // HIDE the slot if it would create a gap too small to be useful
      if (gapInfo.createsUnusableGap && gapInfo.smallestGap < minGapMinutes) {
        continue
      }
    }

    // ── Score the Slot ────────────────────────────────────────────────────
    const score = scoreSlot(slotStart, slotEnd, bookedRanges, dayStartMinutes, dayEndMinutes, year, month - 1, day)

    slots.push({
      time: slotStart,
      score,
      recommended: false, // will be set below
    })
  }

  // ── Tag recommended slots ───────────────────────────────────────────────
  if (maxRecommended > 0 && slots.length > 0) {
    // Sort a copy by score descending to find the best ones
    const sorted = [...slots].sort((a, b) => b.score - a.score)
    const threshold = sorted[Math.min(maxRecommended - 1, sorted.length - 1)].score

    // Only recommend slots that have a meaningfully good score (> 20)
    let recommendedCount = 0
    for (const slot of slots) {
      if (slot.score >= threshold && slot.score > 20 && recommendedCount < maxRecommended) {
        slot.recommended = true
        slot.recommendReason = getRecommendReason(slot.time, new Date(slot.time.getTime() + serviceDuration * 60000), bookedRanges, dayStartMinutes, dayEndMinutes, year, month - 1, day)
        recommendedCount++
      }
    }
  }

  return slots
}

// ─── Gap Analysis ─────────────────────────────────────────────────────────────

interface GapAnalysis {
  /** True if placing a booking here creates a gap smaller than is useful */
  createsUnusableGap: boolean
  /** The smallest gap (in minutes) that would be created */
  smallestGap: number
  /** Gap before the slot (minutes), to the nearest booking or day start */
  gapBefore: number
  /** Gap after the slot (minutes), to the nearest booking or day end */
  gapAfter: number
}

function analyzeGaps(
  slotStart: Date,
  slotEnd: Date,
  bookedRanges: BookedRange[],
  dayStartMinutes: number,
  dayEndMinutes: number,
  year: number,
  monthIdx: number,
  day: number,
): GapAnalysis {
  const dayStart = new Date(year, monthIdx, day, Math.floor(dayStartMinutes / 60), dayStartMinutes % 60)
  const dayEnd = new Date(year, monthIdx, day, Math.floor(dayEndMinutes / 60), dayEndMinutes % 60)

  // Find nearest boundary before this slot
  let nearestBefore = dayStart
  for (const b of bookedRanges) {
    if (b.end <= slotStart && b.end > nearestBefore) {
      nearestBefore = b.end
    }
  }

  // Find nearest boundary after this slot
  let nearestAfter = dayEnd
  for (const b of bookedRanges) {
    if (b.start >= slotEnd && b.start < nearestAfter) {
      nearestAfter = b.start
    }
  }

  const gapBefore = (slotStart.getTime() - nearestBefore.getTime()) / 60000
  const gapAfter = (nearestAfter.getTime() - slotEnd.getTime()) / 60000

  // A gap is "unusable" if it's > 0 but too small for any meaningful service
  // We consider 0-minute gaps fine (contiguous = perfect)
  const createsUnusableGap =
    (gapBefore > 0 && gapBefore < 15) || // less than 15 min gap is always bad
    (gapAfter > 0 && gapAfter < 15)

  const smallestGap = Math.min(
    gapBefore > 0 ? gapBefore : Infinity,
    gapAfter > 0 ? gapAfter : Infinity,
  )

  return {
    createsUnusableGap,
    smallestGap: smallestGap === Infinity ? 999 : smallestGap,
    gapBefore,
    gapAfter,
  }
}

// ─── Slot Scoring ─────────────────────────────────────────────────────────────

/**
 * Score a slot from 0 to 100 based on how well it packs the calendar.
 * 
 * Scoring factors:
 * - Adjacency to existing bookings (highest weight — creates back-to-back blocks)
 * - Adjacency to day boundaries (start/end of business hours)
 * - Fills a "perfect pocket" (slot duration exactly equals the gap)
 * - Empty-day bonus (first booking of the day gets pushed toward start/end)
 */
function scoreSlot(
  slotStart: Date,
  slotEnd: Date,
  bookedRanges: BookedRange[],
  dayStartMinutes: number,
  dayEndMinutes: number,
  year: number,
  monthIdx: number,
  day: number,
): number {
  let score = 0
  const TOLERANCE_MS = 2 * 60 * 1000 // 2 minutes tolerance for "adjacent"

  const dayStart = new Date(year, monthIdx, day, Math.floor(dayStartMinutes / 60), dayStartMinutes % 60)
  const dayEnd = new Date(year, monthIdx, day, Math.floor(dayEndMinutes / 60), dayEndMinutes % 60)

  const isEmptyDay = bookedRanges.length === 0

  // ── Factor 1: Adjacent to an existing booking (0–40 pts) ────────────────
  // Back-to-back with another appointment = maximum scheduling density
  let touchesBefore = false
  let touchesAfter = false

  for (const b of bookedRanges) {
    // Slot starts right when a booking ends
    if (Math.abs(b.end.getTime() - slotStart.getTime()) <= TOLERANCE_MS) {
      touchesBefore = true
    }
    // Slot ends right when a booking starts
    if (Math.abs(b.start.getTime() - slotEnd.getTime()) <= TOLERANCE_MS) {
      touchesAfter = true
    }
  }

  if (touchesBefore && touchesAfter) {
    // Perfect: fills a pocket between two bookings
    score += 40
  } else if (touchesBefore || touchesAfter) {
    // Good: extends a contiguous block
    score += 25
  }

  // ── Factor 2: Adjacent to day boundaries (0–20 pts) ─────────────────────
  // Starting at the beginning or ending at the close of business is ideal
  const touchesDayStart = Math.abs(slotStart.getTime() - dayStart.getTime()) <= TOLERANCE_MS
  const touchesDayEnd = Math.abs(slotEnd.getTime() - dayEnd.getTime()) <= TOLERANCE_MS

  if (touchesDayStart || touchesDayEnd) {
    score += 20
  }

  // ── Factor 3: Perfect pocket fill (0–25 pts) ────────────────────────────
  // If the slot exactly fills the gap between two boundaries, that's ideal
  const gapAnalysis = analyzeGaps(slotStart, slotEnd, bookedRanges, dayStartMinutes, dayEndMinutes, year, monthIdx, day)
  if (gapAnalysis.gapBefore <= 2 && gapAnalysis.gapAfter <= 2) {
    // Slot perfectly fills a pocket — no dead time on either side
    score += 25
  } else if (gapAnalysis.gapBefore <= 2 || gapAnalysis.gapAfter <= 2) {
    score += 10
  }

  // ── Factor 4: Empty-day anchoring (0–15 pts) ────────────────────────────
  // On an empty day, prefer slots near the start or end of the day
  // This anchors the first booking and leaves a clean open block
  if (isEmptyDay) {
    const slotMidpoint = (slotStart.getTime() + slotEnd.getTime()) / 2
    const dayMidpoint = (dayStart.getTime() + dayEnd.getTime()) / 2
    const dayHalfSpan = (dayEnd.getTime() - dayStart.getTime()) / 2

    // How far from the center (0 = at center, 1 = at edge)
    const distFromCenter = Math.abs(slotMidpoint - dayMidpoint) / dayHalfSpan

    // Slots near edges of the day get more points
    score += Math.round(distFromCenter * 15)
  }

  return Math.min(100, Math.max(0, score))
}

// ─── Recommendation Reasons ───────────────────────────────────────────────────

function getRecommendReason(
  slotStart: Date,
  slotEnd: Date,
  bookedRanges: BookedRange[],
  dayStartMinutes: number,
  dayEndMinutes: number,
  year: number,
  monthIdx: number,
  day: number,
): string {
  const TOLERANCE_MS = 2 * 60 * 1000
  const dayStart = new Date(year, monthIdx, day, Math.floor(dayStartMinutes / 60), dayStartMinutes % 60)
  const dayEnd = new Date(year, monthIdx, day, Math.floor(dayEndMinutes / 60), dayEndMinutes % 60)

  // Check for perfect pocket
  const gapAnalysis = analyzeGaps(slotStart, slotEnd, bookedRanges, dayStartMinutes, dayEndMinutes, year, monthIdx, day)
  if (gapAnalysis.gapBefore <= 2 && gapAnalysis.gapAfter <= 2) {
    return 'Perfect fit'
  }

  // Check for back-to-back
  for (const b of bookedRanges) {
    if (Math.abs(b.end.getTime() - slotStart.getTime()) <= TOLERANCE_MS ||
        Math.abs(b.start.getTime() - slotEnd.getTime()) <= TOLERANCE_MS) {
      return 'Back-to-back'
    }
  }

  // Check for day boundary
  if (Math.abs(slotStart.getTime() - dayStart.getTime()) <= TOLERANCE_MS) {
    return 'Start of day'
  }
  if (Math.abs(slotEnd.getTime() - dayEnd.getTime()) <= TOLERANCE_MS) {
    return 'End of day'
  }

  if (bookedRanges.length === 0) {
    return 'Best slot'
  }

  return 'Best match'
}

// ─── Legacy Adapter ───────────────────────────────────────────────────────────

/**
 * Drop-in replacement for the old `generateSlots()` function.
 * Converts the old call signature to the new SmartSlotOptions.
 */
export function generateSlots(
  hoursStart: string,
  hoursEnd: string,
  serviceDuration: number,
  existingBookings: Array<{ scheduled_at: string; services?: { duration_minutes?: number } }>,
  externalEvents: Array<{ start: string; end: string }>,
  selectedDate: string,
  leadTimeHours: number,
  bookingConfig?: { smartGapEnabled?: boolean; minGapMinutes?: number; slotInterval?: number },
): SlotResult[] {
  // Convert legacy booking format to BookedRange[]
  const bookedRanges: BookedRange[] = existingBookings.map(b => {
    const s = new Date(b.scheduled_at)
    const e = new Date(s.getTime() + (b.services?.duration_minutes || 60) * 60 * 1000)
    return { start: s, end: e }
  })

  // Add external events
  for (const e of externalEvents) {
    bookedRanges.push({ start: new Date(e.start), end: new Date(e.end) })
  }

  return generateSmartSlots({
    hoursStart,
    hoursEnd,
    serviceDuration,
    existingBookings: bookedRanges,
    selectedDate,
    leadTimeHours,
    slotInterval: bookingConfig?.slotInterval ?? 15,
    smartGapEnabled: bookingConfig?.smartGapEnabled ?? true,
    minGapMinutes: bookingConfig?.minGapMinutes ?? 30,
    maxRecommended: 3,
  })
}
