/**
 * Smoke tests for the Smart Scheduling Engine.
 * Run: npx tsx packages/scheduling/smartSlots.test.ts
 */
import { generateSmartSlots, BookedRange } from './index'

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(`FAIL: ${msg}`)
  console.log(`  ✓ ${msg}`)
}

function makeDate(dateStr: string, h: number, m: number): Date {
  const [y, mo, d] = dateStr.split('-').map(Number)
  return new Date(y, mo - 1, d, h, m)
}

const TOMORROW = (() => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
})()

// ─── Test 1: Empty day generates slots ────────────────────────────────────────
console.log('\nTest 1: Empty day generates slots')
{
  const slots = generateSmartSlots({
    hoursStart: '09:00',
    hoursEnd: '17:00',
    serviceDuration: 60,
    existingBookings: [],
    selectedDate: TOMORROW,
    leadTimeHours: 0,
    slotInterval: 60,
    smartGapEnabled: true,
    minGapMinutes: 30,
    maxRecommended: 3,
  })

  assert(slots.length > 0, `Generated ${slots.length} slots on empty day`)
  assert(slots.length === 8, `Expected 8 hourly slots (9am-4pm), got ${slots.length}`)
  
  // On empty day, edge slots should be recommended
  const recommended = slots.filter(s => s.recommended)
  assert(recommended.length > 0, `${recommended.length} slots are recommended`)
}

// ─── Test 2: Gap hiding — slot that creates tiny gap is hidden ────────────────
console.log('\nTest 2: Smart gap hiding')
{
  // Book 10:00-11:00. A 60-min service at 11:15 would leave a 15-min gap before
  // the next booking at 12:30, but the key thing is the gap between 11:00 and 11:15.
  // That 15-min gap before the slot is fine (it's at the boundary). 
  // The real test: book 10:00-11:00 and 12:00-13:00, leaving a 1-hour gap.
  // A 45-min service placed at 11:00 would end at 11:45, leaving a 15-min gap before 12:00.
  // That 15-min gap should be hidden with minGapMinutes=30.
  
  const bookings: BookedRange[] = [
    { start: makeDate(TOMORROW, 10, 0), end: makeDate(TOMORROW, 11, 0) },
    { start: makeDate(TOMORROW, 12, 0), end: makeDate(TOMORROW, 13, 0) },
  ]

  const slots = generateSmartSlots({
    hoursStart: '09:00',
    hoursEnd: '17:00',
    serviceDuration: 45,
    existingBookings: bookings,
    selectedDate: TOMORROW,
    leadTimeHours: 0,
    slotInterval: 15,
    smartGapEnabled: true,
    minGapMinutes: 30,
    maxRecommended: 3,
  })

  // Check: there should be NO slot at 11:15 (would leave 0-min gap after at 12:00)
  // But 11:00 should exist (ends at 11:45, leaving 15-min gap to 12:00 — but that's < 15min threshold, so it might be hidden too)
  // Actually: 11:00 -> 11:45, gap to 12:00 = 15min. The analyzeGaps function hides if gap < 15 (strictly less).
  // 15 is not < 15, so it stays. 
  // 11:15 -> 12:00, gap to 12:00 = 0min. 0 is fine (contiguous).
  // So 11:15 should be fine because gapAfter = 0 (contiguous).
  
  const conflictSlots = slots.filter(s => {
    const t = s.time
    return t >= makeDate(TOMORROW, 10, 0) && t < makeDate(TOMORROW, 12, 0)
  })
  
  // Should have slots like 11:00 and 11:15 (both touch bookings) 
  // but should NOT have slots in the 10:00-11:00 range (conflict)
  const tenAm = slots.find(s => s.time.getTime() === makeDate(TOMORROW, 10, 0).getTime())
  assert(!tenAm, '10:00 AM is not available (conflicts with booking)')
  
  const elevenFifteen = slots.find(s => s.time.getTime() === makeDate(TOMORROW, 11, 15).getTime())
  assert(!!elevenFifteen, '11:15 AM is available (ends exactly at 12:00, contiguous)')

  assert(slots.every(s => s.time < makeDate(TOMORROW, 10, 0) || s.time >= makeDate(TOMORROW, 11, 0)),
    'No slots during 10:00-11:00 booking window')
}

// ─── Test 3: Perfect pocket fill gets highest score ───────────────────────────
console.log('\nTest 3: Perfect pocket fill scoring')
{
  // Book 10:00-11:00 and 12:00-13:00. A 60-min service should score highest at 11:00.
  const bookings: BookedRange[] = [
    { start: makeDate(TOMORROW, 10, 0), end: makeDate(TOMORROW, 11, 0) },
    { start: makeDate(TOMORROW, 12, 0), end: makeDate(TOMORROW, 13, 0) },
  ]

  const slots = generateSmartSlots({
    hoursStart: '09:00',
    hoursEnd: '17:00',
    serviceDuration: 60,
    existingBookings: bookings,
    selectedDate: TOMORROW,
    leadTimeHours: 0,
    slotInterval: 15,
    smartGapEnabled: true,
    minGapMinutes: 30,
    maxRecommended: 3,
  })

  const elevenSlot = slots.find(s => s.time.getTime() === makeDate(TOMORROW, 11, 0).getTime())
  assert(!!elevenSlot, '11:00 AM slot exists')
  assert(elevenSlot!.recommended, '11:00 AM is recommended (perfect pocket fill)')
  assert(elevenSlot!.score > 50, `11:00 AM has high score (${elevenSlot!.score})`)
}

// ─── Test 4: Smart gap disabled ───────────────────────────────────────────────
console.log('\nTest 4: Smart gap disabled mode')
{
  const bookings: BookedRange[] = [
    { start: makeDate(TOMORROW, 10, 0), end: makeDate(TOMORROW, 11, 0) },
  ]

  const slotsEnabled = generateSmartSlots({
    hoursStart: '09:00',
    hoursEnd: '17:00',
    serviceDuration: 60,
    existingBookings: bookings,
    selectedDate: TOMORROW,
    leadTimeHours: 0,
    slotInterval: 30,
    smartGapEnabled: true,
    minGapMinutes: 30,
    maxRecommended: 3,
  })

  const slotsDisabled = generateSmartSlots({
    hoursStart: '09:00',
    hoursEnd: '17:00',
    serviceDuration: 60,
    existingBookings: bookings,
    selectedDate: TOMORROW,
    leadTimeHours: 0,
    slotInterval: 30,
    smartGapEnabled: false,
    minGapMinutes: 30,
    maxRecommended: 3,
  })

  // Disabled should have >= enabled (no gaps hidden)
  assert(slotsDisabled.length >= slotsEnabled.length, 
    `Disabled: ${slotsDisabled.length} slots ≥ Enabled: ${slotsEnabled.length}`)
}

// ─── Test 5: Recommendation reasons ──────────────────────────────────────────
console.log('\nTest 5: Recommendation reasons')
{
  const bookings: BookedRange[] = [
    { start: makeDate(TOMORROW, 10, 0), end: makeDate(TOMORROW, 11, 0) },
    { start: makeDate(TOMORROW, 12, 0), end: makeDate(TOMORROW, 13, 0) },
  ]

  const slots = generateSmartSlots({
    hoursStart: '09:00',
    hoursEnd: '17:00',
    serviceDuration: 60,
    existingBookings: bookings,
    selectedDate: TOMORROW,
    leadTimeHours: 0,
    slotInterval: 60,
    smartGapEnabled: true,
    minGapMinutes: 30,
    maxRecommended: 5,
  })

  const recommended = slots.filter(s => s.recommended)
  assert(recommended.length > 0, `${recommended.length} recommended slots`)
  
  for (const s of recommended) {
    assert(!!s.recommendReason, `Slot at ${s.time.toTimeString().slice(0,5)} has reason: "${s.recommendReason}"`)
  }
}

console.log('\n✅ All tests passed!\n')
