# Custom Date Range Reports

**Effort:** 2 days | **Impact:** Medium | **Priority:** 8

## Overview

Allow users to generate reports for any custom date range (vs. fixed monthly/annual).

## Features

- **Date range picker** – Select start and end dates
- **Metric selection** – Choose which metrics to include
- **Export options** – PDF, CSV, Excel
- **Scheduled reports** – Auto-generate and email weekly/monthly
- **Report history** – Save previous reports

## Implementation

### Day 1: Report Builder UI
Create `/apps/Admin/src/components/ReportBuilder.tsx`:
- Date range picker (use existing UI library)
- Checklist of metrics
- Preview of report
- Export button

### Day 2: Report Generation
Create `/functions/reports/reportGenerator.js`:
```javascript
async function generateReport(orgId, metrics, dateRange) {
  // Query all relevant data
  // Aggregate metrics for date range
  // Format for PDF/CSV/Excel
  // Return file or stream
}
```

## Integration

Works with existing analytics data:
- Appointments
- Revenue
- Client count
- Service performance
- Staff performance

## Testing Checklist

- [ ] Date range picker functional
- [ ] Report generation accurate
- [ ] PDF export looks good
- [ ] CSV/Excel exports correctly
- [ ] Handles large date ranges (1+ year)
- [ ] Performance acceptable

## Files to Create

```
/functions/
  reports/
    reportGenerator.js (new)
    
/apps/Admin/src/
  pages/Reports.tsx (enhance existing)
  components/
    ReportBuilder.tsx (new)
    ReportExport.tsx (new)
```
