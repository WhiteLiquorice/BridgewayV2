# Client Segmentation

**Effort:** 2 days | **Impact:** Medium | **Priority:** 9

## Overview

Tag and segment clients by service preference, frequency, spend tier, and other attributes for targeted campaigns.

## Features

- **Pre-built segments** – High-value, at-risk, inactive, frequent bookers
- **Custom segments** – Create rules for custom segmentation
- **Segment list view** – See all clients in a segment
- **Bulk actions** – Email, reschedule, tag segments
- **Segment analytics** – Revenue, frequency by segment

## Implementation

### Day 1: Segment UI
Create `/apps/Admin/src/pages/ClientSegments.tsx`:
- Show pre-built segments with counts
- Create custom segment dialog
- List all segments
- View clients in segment

### Day 2: Segmentation Logic
Create `/functions/segments/segmentationEngine.js`:
```javascript
// Segment rules:
// High-value: CLV > $1000
// At-risk: 60+ days no appointment
// Frequent: 4+ appointments last 3 months
// New: Created < 30 days ago
```

## Database Schema

**New Collection: `clientSegments`**
```
{
  id: string
  orgId: string
  name: string
  type: string (predefined/custom)
  rules: array
  memberCount: number
  updatedAt: timestamp
}
```

## Testing Checklist

- [ ] Segment rules work correctly
- [ ] Member counts accurate
- [ ] Bulk actions work on segments
- [ ] Performance with 10k+ clients
- [ ] Segments refresh appropriately

## Files to Create

```
/functions/
  segments/
    segmentationEngine.js (new)
    
/apps/Admin/src/
  pages/ClientSegments.tsx (new)
  components/
    SegmentBuilder.tsx (new)
    SegmentList.tsx (new)
```
