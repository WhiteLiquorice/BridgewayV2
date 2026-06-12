# Capacity Planning & Forecasting

**Effort:** 4 days | **Impact:** Medium | **Priority:** Tier 3

## Overview

Forecast future capacity needs and recommend hiring, training, or expansion.

## Features

- **Capacity forecast** – Project room/staff needs 3-12 months out
- **Growth trajectory** – Show booking growth trend
- **Hiring recommendation** – "You'll need 2 more staff by Q3"
- **Equipment forecast** – Predict when new equipment needed
- **Training needs** – Identify gaps in current staff skills

## Implementation

### Day 1-2: Historical Analysis
- Analyze 12+ months of data
- Identify growth rate
- Predict next 12 months

### Day 3: Capacity Model
- Project appointment volume
- Calculate staff hours needed
- Calculate space needed

### Day 4: Dashboard
- Forecast charts
- Recommendation cards
- Hiring timeline

## Testing Checklist

- [ ] Forecast accuracy >80%
- [ ] Updates monthly
- [ ] Handles growth/decline correctly

## Files to Create

```
/functions/
  forecasting/
    capacityForecast.js (new)
    
/apps/Admin/src/
  pages/CapacityPlanning.tsx (new)
```
