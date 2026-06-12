# Recurring Revenue Dashboard

**Effort:** 2 days | **Impact:** Medium | **Priority:** 11

## Overview

Track subscription/recurring revenue clients separately. Show MRR, retention metrics, and churn risk.

## Features

- **Recurring clients list** – Filter clients with subscriptions
- **MRR dashboard** – Monthly Recurring Revenue tracking
- **MRR trend** – Growth/decline over time
- **Churn risk** – Subscription clients at risk of canceling
- **ARPU** – Average Revenue Per User
- **Retention metrics** – Cohort retention by subscription month

## Database Schema Changes

**Enhance: `clients`**
- Add: `isRecurring: boolean` (has active subscription)
- Add: `recurringRevenuePerMonth: number`
- Add: `subscriptionStartDate: timestamp`
- Add: `nextBillingDate: timestamp`

**New Collection: `mrrHistory`**
```
{
  id: string (orgId_month)
  orgId: string
  month: timestamp (first day of month)
  totalMRR: number
  activeSubscriptions: number
  newSubscriptions: number
  canceledSubscriptions: number
  averageARPU: number
  createdAt: timestamp
}
```

## Implementation Steps

### Day 1: Data Aggregation
Create `/functions/analytics/mrrCalculator.js`:
- Calculate total MRR from recurring clients
- Track MRR trend month-over-month
- Identify churn risk from recurring clients

### Day 2: Dashboard UI
Create `/apps/Admin/src/pages/RecurringRevenue.tsx`:
- MRR summary card
- MRR trend chart
- Recurring clients list
- At-risk subscribers

## Testing Checklist

- [ ] MRR calculation accurate
- [ ] Churn risk detection works
- [ ] Dashboard loads <1s
- [ ] Trend calculations correct
- [ ] Handles 0 recurring clients

## Files to Create

```
/functions/
  analytics/
    mrrCalculator.js (new)
    
/apps/Admin/src/
  pages/RecurringRevenue.tsx (new)
  components/
    MRRChart.tsx (new)
    RecurringClientsList.tsx (new)
```
