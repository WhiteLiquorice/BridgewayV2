# Smart Resource Allocation

**Effort:** 5 days | **Impact:** High | **Priority:** 1

## Overview

Recommend staff scheduling based on appointment density, client preferences, and historical patterns. This feature helps businesses optimize labor costs and client satisfaction by matching staff capacity to demand.

## Features

- **Demand Forecasting** – Predict appointment volume by time slot/day/week
- **Staff Matching** – Recommend which staff members to schedule based on client preferences and availability
- **Shift Optimization** – Suggest shift lengths and break times to minimize idle time
- **Capacity Alerts** – Warn when overbooking or understaffing is predicted

## Database Schema Changes

**New Collection: `staffScheduleSuggestions`**
```
{
  id: string (UUID)
  orgId: string
  staffId: string
  dateRange: { start: timestamp, end: timestamp }
  predictedAppointments: number
  recommendedHours: number
  clientPreferences: string[] (staff IDs preferred by returning clients)
  confidenceScore: number (0-100)
  createdAt: timestamp
}
```

**Enhance Table: `appointments`**
- Add field: `preferredStaffId` (string, optional) – Client preference
- Add field: `staffMatchScore` (number, optional) – Quality of staff-client match

**Enhance Table: `staffMembers`**
- Add field: `preferenceScore` (number) – Ranking from clients

## Implementation Steps

### Step 1: Create Demand Forecast Function (Day 1)
Location: `/functions/forecasting/demandForecast.js`

```javascript
// Analyzes appointment history to predict future demand
async function forecastDemand(orgId, dateRange) {
  // Aggregate appointments by:
  // - Day of week
  // - Time of day (1-hour buckets)
  // - Service type
  // - Staff member
  
  // Calculate trends:
  // - Weekly patterns (Mon-Sun)
  // - Seasonal patterns (month-over-month)
  // - Special event dates
  
  return {
    dailyForecasts: [...],
    weeklyTrends: {...},
    confidenceScore: 0.85
  };
}
```

### Step 2: Build Staff Matching Algorithm (Day 2)
Location: `/functions/scheduling/staffMatcher.js`

```javascript
// Matches staff to forecasted appointments
async function matchStaffToAppointments(orgId, appointments, staffMembers) {
  // For each appointment:
  // 1. Find staff with required skills
  // 2. Check availability
  // 3. Score based on:
  //    - Client preference history
  //    - Staff workload (balance)
  //    - Travel time between locations
  // 4. Return ranked list of candidates
}
```

### Step 3: Admin Dashboard Widget (Day 2-3)
Location: `/apps/Admin/src/pages/StaffScheduling.tsx` (create new page)

**Features:**
- Week view with demand forecast overlay
- Drag-to-assign staff to shifts
- Conflict detection (overlapping appointments)
- Staff utilization % by week
- Recommended vs. actual schedule comparison

### Step 4: API Endpoints (Day 3-4)
Add to Cloud Functions:

```
POST /api/forecast
  - Request: { orgId, dateRange }
  - Response: { dailyForecasts, weeklyTrends, alerts }

POST /api/matchStaff
  - Request: { orgId, appointmentId }
  - Response: { rankedStaffOptions: [...] }

GET /api/scheduleHealth
  - Response: { utilizationRate, overbooked, understaffed }
```

### Step 5: Testing & Refinement (Day 4-5)
- Test with last 90 days of real appointment data
- Validate forecast accuracy
- Gather feedback from staff/managers
- Refine scoring algorithm based on actual outcomes

## Integration Points

**Connects to:**
- Appointments data (historical volume)
- Staff members (availability, skills)
- Clients (preferences)
- Calendar/Availability system

**Used by:**
- Admin Dashboard (staff scheduling page)
- Automated shift recommendations

## Performance Considerations

- **Firestore indexes needed:**
  - `appointments: (orgId, dateRange, staffId)`
  - `staffMembers: (orgId, skills)`
- **Caching:** Cache demand forecasts daily (demand doesn't change hourly)
- **Batch operations:** Process multiple weeks at once to reduce API calls

## Testing Checklist

- [ ] Forecast accuracy within 20% of actual appointments
- [ ] Staff matching respects availability constraints
- [ ] Handles edge cases (all staff unavailable, no qualified staff)
- [ ] Admin UI responsive and intuitive
- [ ] No performance degradation with 1000+ appointments

## Files to Create/Modify

```
/functions/
  forecasting/
    demandForecast.js
    utils.js
  scheduling/
    staffMatcher.js
    
/apps/Admin/src/
  pages/StaffScheduling.tsx (new)
  components/
    forecast/
      DemandChart.tsx (new)
      StaffScheduleMatrix.tsx (new)
      ConflictAlert.tsx (new)
```

## Quick Start

1. Copy starter template from `STARTER_CODE/demandForecast.js`
2. Integrate with existing Firestore queries
3. Deploy Cloud Function
4. Build Admin UI using existing component patterns
5. Test with production data slice
