# Service Analytics & Performance

**Effort:** 3 days | **Impact:** High | **Priority:** 4

## Overview

Deep analytics on service performance: booking trends, revenue, profitability, client satisfaction, and growth rates.

## Key Metrics

- **Booking volume** – Total bookings, month-over-month growth
- **Revenue** – Total revenue per service, trend analysis
- **Profitability** – Revenue minus cost of goods (if tracked)
- **Client satisfaction** – Average rating, feedback themes
- **No-show rate** – Cancellation and no-show %, impact
- **Capacity utilization** – Booked vs. available slots
- **Seasonal trends** – Peak months, slow periods

## Database Schema Changes

**New Collection: `serviceMetrics`**
```
{
  id: string (serviceId_date)
  serviceId: string
  orgId: string
  date: timestamp
  bookings: number
  revenue: number
  averageRating: number
  noShowRate: number (0-1)
  avgWaitTime: number (minutes)
  capacityUtilization: number (0-1)
  previousMonthBookings: number
  previousMonthRevenue: number
  createdAt: timestamp
}
```

## Implementation Steps

### Day 1: Data Aggregation Function
Create `/functions/analytics/serviceMetricsCalculator.js`:
- Aggregate bookings by service, date
- Calculate revenue from payments
- Compute no-show rates
- Calculate ratings (if feedback system exists)

### Day 2: Admin Dashboard Widget
Create `/apps/Admin/src/pages/ServiceAnalytics.tsx`:
- Service list with top performers
- Charts: booking trends, revenue trends, no-show rates
- Comparison: current month vs. previous month
- Filters: date range, service type

### Day 3: Drill-down Views
- Individual service detail page
- Client distribution by service
- Time-of-day popularity
- Staff performance within service

## Testing Checklist

- [ ] Metrics calculate correctly for test data
- [ ] Dashboard loads <2s with 100 services
- [ ] Month-over-month calculations accurate
- [ ] Handles edge cases (0 bookings, no ratings)

## Files to Create

```
/functions/
  analytics/
    serviceMetricsCalculator.js (new)
    
/apps/Admin/src/
  pages/ServiceAnalytics.tsx (new)
  components/
    analytics/
      ServicePerformanceChart.tsx (new)
      TopServicesTable.tsx (new)
      ServiceDetailView.tsx (new)
```
