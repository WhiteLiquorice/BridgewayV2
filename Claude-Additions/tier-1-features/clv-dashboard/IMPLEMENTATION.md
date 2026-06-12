# Client Lifetime Value (CLV) Dashboard

**Effort:** 4 days | **Impact:** High | **Priority:** 2

## Overview

Track and visualize each client's spending patterns, retention metrics, and lifetime value. Identify high-value clients, at-risk clients, and opportunities for upselling.

## Features

- **CLV Calculation** – Total spent + projected future value
- **Client Tiers** – Gold/Silver/Bronze segmentation by CLV
- **Churn Risk Scoring** – Flag clients not seen in 60+ days
- **Retention Cohorts** – Analyze cohort retention curves
- **Upsell Opportunities** – Identify cross-sell & upgrade potential
- **Lifetime Analytics** – First visit → Current status timeline

## Database Schema Changes

**New Collection: `clientMetrics`**
```
{
  id: string (client UUID + date)
  clientId: string
  orgId: string
  totalSpent: number
  appointmentCount: number
  averageTicketValue: number
  lastAppointmentDate: timestamp
  daysSinceLastVisit: number
  churnRiskScore: number (0-100)
  lifeTimeValue: number (revenue + projected)
  tier: string (gold/silver/bronze)
  preferredServices: string[] (top 3)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Enhance: `clients`**
- Add: `lastMetricsRefresh: timestamp`
- Add: `churnRiskFlag: boolean`

## Implementation Steps

### Step 1: CLV Calculation Engine (Day 1)
Location: `/functions/analytics/clvCalculator.js`

```javascript
async function calculateCLV(clientId, orgId) {
  // 1. Get all appointments for client
  // 2. Sum revenue
  // 3. Predict future value based on:
  //    - Average frequency (appointments per month)
  //    - Average value per appointment
  //    - Service trend (increasing/decreasing spend)
  // 4. Calculate LTV = Historical + Projected (next 12 months)
  
  return {
    historicalValue: number,
    projectedValue: number,
    lifeTimeValue: number,
    appointmentCount: number,
    averageTicketValue: number
  };
}
```

### Step 2: Churn Risk Scoring (Day 1-2)
Location: `/functions/analytics/churnPredictor.js`

```javascript
async function scoreChurnRisk(clientId, orgId) {
  // Factors:
  // 1. Days since last appointment (weight: 40%)
  // 2. Visit frequency trend (declining? weight: 30%)
  // 3. Service diversity (narrow selection = risk? weight: 20%)
  // 4. Satisfaction signals (ratings, cancellations? weight: 10%)
  
  return {
    churnRiskScore: 0-100,
    riskFactors: [],
    recommendation: string
  };
}
```

### Step 3: Batch Metrics Calculation (Day 2)
Location: `/functions/tasks/refreshClientMetrics.js`

```javascript
// Scheduled daily (Cloud Scheduler)
// Refreshes metrics for all clients in org
async function refreshAllClientMetrics(orgId) {
  // 1. Get all active clients
  // 2. Calculate CLV + churn risk for each
  // 3. Upsert into clientMetrics collection
  // 4. Log completion metrics
}
```

### Step 4: Admin CLV Dashboard (Day 2-3)
Location: `/apps/Admin/src/pages/ClientValue.tsx` (create new)

**Widgets:**
- Top Tier Distribution (Donut chart: Gold/Silver/Bronze)
- At-Risk Clients (Table with churn scores)
- CLV Trend (Line chart of avg CLV over time)
- Retention Cohorts (Waterfall chart by acquisition month)
- Upsell Opportunities (Table: high-value clients not using premium services)

### Step 5: Client Detail Enhancements (Day 3-4)
Update: `/apps/Dashboard/src/pages/ClientDetail.tsx`

**New sections:**
- CLV summary card
- Lifetime appointment timeline
- Service purchase pattern
- Predicted next visit date
- Recommended next service (based on preferences)

### Step 6: Alerts & Actions (Day 4)
Create: `/apps/Admin/src/components/ClientAlerts.tsx`

**Features:**
- Alert when client marked as churn risk
- Bulk email "we miss you" campaigns
- Discount code generation for at-risk clients
- Notes/tasks to staff to follow up

## Integration Points

**Reads from:**
- Appointments
- Clients
- Payments/Billing
- Service catalog

**Feeds:**
- Admin dashboard
- Client detail views
- Marketing campaigns (at-risk clients)
- Reports

## Performance Considerations

- **Batch operations:** Calculate metrics once daily (off-peak)
- **Caching:** Cache CLV data with 24-hour TTL
- **Indexes:** `appointments: (clientId, orgId, createdAt)`
- **Pagination:** Load top 100 clients in dashboard, allow filtering

## Testing Checklist

- [ ] CLV calculation accurate for test clients
- [ ] Churn risk detection identifies at-risk clients correctly
- [ ] Batch refresh completes within 5 min for 10k clients
- [ ] Dashboard loads in <2s with 10k clients
- [ ] Cohort retention math validated manually
- [ ] Upsell recommendations make business sense

## Files to Create/Modify

```
/functions/
  analytics/
    clvCalculator.js (new)
    churnPredictor.js (new)
  tasks/
    refreshClientMetrics.js (new)
    
/apps/Admin/src/
  pages/ClientValue.tsx (new)
  components/
    analytics/
      CLVChart.tsx (new)
      ChurnRiskTable.tsx (new)
      CohortRetention.tsx (new)
      UpsellOpportunities.tsx (new)
      
/apps/Dashboard/src/
  pages/ClientDetail.tsx (modify)
```

## Deployment Order

1. Deploy CLV calculator function
2. Deploy churn predictor function
3. Deploy batch metrics refresh (schedule daily at 2am)
4. Build Admin dashboard
5. Update Client Detail page
6. Test end-to-end
