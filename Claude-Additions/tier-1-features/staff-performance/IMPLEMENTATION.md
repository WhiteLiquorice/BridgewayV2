# Staff Performance & Metrics

**Effort:** 4 days | **Impact:** Medium-High | **Priority:** 6

## Overview

Track staff productivity, quality, and satisfaction metrics. Enable performance reviews and identify training needs.

## Key Metrics

- **Appointments completed** – Total, on-time completion rate
- **Average session duration** – Planned vs. actual
- **Client satisfaction** – Average rating per staff
- **Utilization rate** – Booked vs. available hours
- **Revenue generated** – Total revenue from client bookings
- **Top services** – Which services each staff member excels at
- **Tenure & experience** – Time with company, certifications

## Database Schema Changes

**New Collection: `staffMetrics`**
```
{
  id: string (staffId_date)
  staffId: string
  orgId: string
  date: timestamp
  appointmentsCompleted: number
  onTimeRate: number (0-1)
  averageRating: number (1-5)
  hoursBooked: number
  hoursAvailable: number
  revenueGenerated: number
  clientsServed: number
  createdAt: timestamp
}
```

## Implementation Steps

### Day 1: Metrics Calculation
Create `/functions/analytics/staffMetricsCalculator.js`:
- Count completed appointments
- Calculate on-time completion
- Average client ratings
- Revenue attribution

### Day 2-3: Admin Staff Dashboard
Create `/apps/Admin/src/pages/StaffPerformance.tsx`:
- Staff leaderboard (by revenue, ratings, appointments)
- Individual staff detail page
- Performance trends over time
- Service specialization breakdown

### Day 4: Staff Self-Service View
Update `/apps/Dashboard/src/pages/StaffProfile.tsx`:
- Personal performance metrics
- Client feedback/ratings
- Areas for improvement
- Goals and targets

## Integration with Feedback System

- Collect client ratings post-appointment
- Display ratings on staff profile
- Track satisfaction trends
- Alert on declining satisfaction

## Testing Checklist

- [ ] Metrics calculate accurately
- [ ] Ratings correctly attributed to staff
- [ ] Dashboard responsive with 100+ staff members
- [ ] Trend calculations valid
- [ ] Handles staff with no ratings

## Files to Create

```
/functions/
  analytics/
    staffMetricsCalculator.js (new)
    
/apps/Admin/src/
  pages/StaffPerformance.tsx (new)
  components/
    analytics/
      StaffLeaderboard.tsx (new)
      StaffDetailView.tsx (new)
      
/apps/Dashboard/src/
  pages/StaffProfile.tsx (enhance)
```
