# Real-Time Queue Management

**Effort:** 3 days | **Impact:** High | **Priority:** 5

## Overview

Visual real-time queue status for check-ins, service wait times, and flow management. Improves client experience and staff coordination.

## Features

- **Live Queue View** – See who's checked in, who's waiting
- **Wait Time Estimates** – Predict time to service for each client
- **Staff Assignment** – Assign staff to waiting clients with one click
- **Client Notifications** – Alert clients when approaching service time
- **Queue Analytics** – Average wait time, peak hours, bottlenecks

## Database Schema Changes

**New Collection: `queueEntries`**
```
{
  id: string (UUID)
  orgId: string
  appointmentId: string
  clientId: string
  clientName: string
  serviceName: string
  checkInTime: timestamp
  expectedServiceTime: number (minutes)
  actualServiceStartTime: timestamp (nullable)
  actualServiceEndTime: timestamp (nullable)
  staffAssignedId: string (nullable)
  status: string (waiting/in-service/completed)
  createdAt: timestamp
}
```

**Enhance: `appointments`**
- Add: `checkedInAt: timestamp (nullable)`
- Add: `estimatedWaitTime: number (minutes)`

## Implementation Steps

### Step 1: Queue Data Model (Day 1)
Location: `/functions/queue/queueService.js`

```javascript
// Add queue entry when client checks in (Kiosk app)
async function addToQueue(appointmentId, clientData) {
  // Create queue entry
  // Calculate expected service time from service duration
  // Store in Firestore
  // Emit real-time event for listeners
}

// Update when service starts/ends
async function updateQueueStatus(queueId, status, staffId) {
  // Update status
  // Record timestamps
  // Emit event
}
```

### Step 2: Wait Time Predictor (Day 1-2)
Location: `/functions/queue/waitTimePredictor.js`

```javascript
async function estimateWaitTime(queueId) {
  // Get current queue
  // For each person ahead: add their service time
  // Factor in staff availability
  // Account for historical variance
  // Return estimate + confidence
}
```

### Step 3: Kiosk Queue View (Day 1-2)
Update: `/apps/Kiosk/src/components/QueueDisplay.tsx` (create new)

**Shows:**
- Current queue position
- Estimated wait time
- Service provider info
- Fun messages during wait ("Relax, you're doing great!")
- Option to notify when approaching

### Step 4: Staff Dashboard Queue Management (Day 2)
Create: `/apps/Dashboard/src/pages/Queue.tsx` (exists, enhance)

**Features:**
- Queue list with wait times
- One-click staff assignment
- Service completion buttons
- Queue backlog alerts
- Average wait time chart

### Step 5: Real-Time Updates (Day 2-3)
Implement Firebase Realtime listeners

```javascript
// In Kiosk + Dashboard apps:
useEffect(() => {
  const queueRef = db.collection('queues')
    .where('orgId', '==', orgId)
    .where('status', '!=', 'completed')
    .orderBy('checkInTime');
  
  const unsubscribe = queueRef.onSnapshot((snapshot) => {
    setQueue(snapshot.docs.map(doc => doc.data()));
  });
  
  return unsubscribe;
}, [orgId]);
```

### Step 6: Queue Analytics (Day 3)
Location: `/apps/Admin/src/components/analytics/QueueMetrics.tsx`

**Metrics:**
- Average wait time by hour/day/week
- Peak queue hours
- Staff utilization during busy times
- Service time accuracy (predicted vs. actual)

## Integration Points

**Reads from:**
- Appointments
- Service catalog (duration)
- Staff availability
- Kiosk check-ins

**Writes to:**
- Queue entries
- Appointments (status updates)
- Notifications (send to clients)

## Real-Time Sync Strategy

Use Firebase Firestore listeners:
- Kiosk: Listen to own queue entry + position in queue
- Dashboard: Listen to all queue entries for assigned staff
- Admin: Listen to all queue entries for location/org

Minimize write frequency to avoid excessive updates.

## Testing Checklist

- [ ] Queue entry created on Kiosk check-in
- [ ] Wait time estimate within 15% of actual
- [ ] Real-time updates arrive within 2s
- [ ] Staff assignment updates queue immediately
- [ ] Completed service removes from queue
- [ ] Queue clear on app reconnect
- [ ] Handles 50+ people in queue without lag

## Files to Create/Modify

```
/functions/
  queue/
    queueService.js (new)
    waitTimePredictor.js (new)
    
/apps/Kiosk/src/
  components/
    QueueDisplay.tsx (new)
  pages/CheckIn.tsx (modify to call queueService)
    
/apps/Dashboard/src/
  pages/Queue.tsx (enhance existing)
  components/
    QueueList.tsx (new)
    StaffAssignment.tsx (new)
    
/apps/Admin/src/
  components/
    analytics/
      QueueMetrics.tsx (new)
```

## Deployment Checklist

1. Create `queueEntries` collection in Firestore
2. Deploy queue service functions
3. Update Kiosk check-in flow
4. Enhance Dashboard Queue page
5. Test with staff during operational hours
6. Monitor error rates for 1 week
7. Gather feedback and refine
