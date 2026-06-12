# Client Feedback & Ratings System

**Effort:** 3 days | **Impact:** Medium | **Priority:** Tier 3

## Overview

Collect post-appointment feedback from clients. Track satisfaction and identify improvement areas.

## Features

- **Post-appointment survey** – 1-5 star rating + comment
- **Service rating** – Rate the specific service
- **Staff rating** – Rate the staff member
- **Overall satisfaction** – General satisfaction with business
- **Feedback trends** – See feedback over time
- **Sentiment analysis** – Extract themes from comments (optional)

## Database Schema Changes

**New Collection: `feedback`**
```
{
  id: string (UUID)
  orgId: string
  clientId: string
  appointmentId: string
  serviceRating: number (1-5)
  staffRating: number (1-5)
  overallRating: number (1-5)
  comment: string (optional)
  wouldRecommend: boolean (NPS question)
  sentiment: string (positive/neutral/negative) - optional
  createdAt: timestamp
}
```

## Implementation Steps

### Day 1: Feedback Collection
- Post-appointment survey UI
- Email survey link to clients
- Kiosk in-app survey option

### Day 2: Backend & Storage
- Store feedback in Firestore
- Calculate average ratings
- Email notifications when negative feedback

### Day 3: Dashboard & Analysis
- Feedback dashboard
- Average ratings chart
- Recent feedback display
- Alerts for low ratings

## Integration Points

- Trigger survey email after appointment completion
- Update staff rating from feedback
- Use feedback for churn prediction
- Display ratings on staff profile

## Testing Checklist

- [ ] Survey can be completed in <1 min
- [ ] Ratings calculated correctly
- [ ] Alerts trigger on low ratings
- [ ] Dashboard responsive

## Files to Create

```
/functions/
  feedback/
    feedbackService.js (new)
    
/apps/Portal/src/
  components/
    FeedbackForm.tsx (new)
    
/apps/Admin/src/
  pages/FeedbackAnalytics.tsx (new)
```
