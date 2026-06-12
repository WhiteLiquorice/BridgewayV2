# Data & Analytics Optimization Guide

Optimize database queries, caching, real-time sync, and event tracking.

## 1. Firestore Query Optimization (2-3 days)

### Identify Slow Queries

**Check Cloud Firestore dashboard:**
- Go to Cloud Console → Firestore → Indexes
- Look for "slower than X ms" warnings
- Review query analysis

**Common issues:**
```javascript
// ❌ Bad: Fetching all data then filtering
const all = await db.collection('appointments').get();
const filtered = all.docs.filter(d => d.data().status === 'completed');

// ✅ Good: Filter in query
const filtered = await db.collection('appointments')
  .where('status', '==', 'completed')
  .get();
```

### Create Proper Indexes

**Composite indexes needed when:**
- Filtering + ordering on different fields
- Multiple where clauses + ordering

**Example:**
```javascript
// Query
db.collection('appointments')
  .where('orgId', '==', orgId)
  .where('status', '==', 'completed')
  .orderBy('createdAt', 'desc')

// Index needed
// - orgId (Ascending)
// - status (Ascending)
// - createdAt (Descending)
```

### Query Best Practices

```javascript
// ✅ Do
db.collection('appointments')
  .where('orgId', '==', orgId)
  .where('status', '==', 'completed')
  .orderBy('createdAt', 'desc')
  .limit(50);

// ❌ Don't
db.collection('appointments').get(); // Fetch all!

// ❌ Don't
db.collection('appointments')
  .where('createdAt', '>=', date1)
  .where('createdAt', '<=', date2)
  .orderBy('status'); // Wrong field order

// ❌ Don't
db.collection('appointments')
  .orderBy('createdAt')
  .orderBy('status'); // Multiple orderings need composite index
```

### Pagination

```javascript
// First page
const first = await db.collection('appointments')
  .where('orgId', '==', orgId)
  .limit(50)
  .get();

// Next page
const next = await db.collection('appointments')
  .where('orgId', '==', orgId)
  .startAfter(first.docs[first.docs.length - 1])
  .limit(50)
  .get();
```

---

## 2. Caching Strategy (2-3 days)

### Client-Side Caching (React Query)

**Configure smart cache times:**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data fresh for 1 minute
      staleTime: 1000 * 60,
      // Keep cache for 5 minutes
      gcTime: 1000 * 60 * 5,
    },
  },
});
```

**Use staleTime appropriately:**
```javascript
// High-frequency changes → short stale time
useQuery({
  queryKey: ['queue'],
  queryFn: fetchQueue,
  staleTime: 0, // Always refetch
});

// Stable data → long stale time
useQuery({
  queryKey: ['services'],
  queryFn: fetchServices,
  staleTime: 1000 * 60 * 60, // 1 hour
});
```

### Firestore Persistence

```javascript
// Enable offline persistence
import { initializeFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const db = initializeFirestore(app, {});
enableIndexedDbPersistence(db);

// Now queries work offline (with cached data)
```

### Cache Invalidation

```javascript
// Invalidate cache when data changes
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: updateClient,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['clients'] });
  },
});
```

### What to Cache

**Cache for long time (1+ hour):**
- Service catalog
- Staff list
- Organization settings
- Static content

**Cache for medium time (5-15 min):**
- Appointment list
- Client list
- Analytics data
- Reports

**Cache for short time (<1 min):**
- Queue status
- Real-time metrics
- Chat messages
- User notifications

---

## 3. Event Tracking (1-2 days)

### Track Key Events

```javascript
// Initialize analytics
import { analytics } from './firebase';
import { logEvent } from 'firebase/analytics';

// Track user actions
logEvent(analytics, 'appointment_booked', {
  clientId: client.id,
  serviceId: service.id,
  staffId: staff.id,
  amount: payment.amount,
});

logEvent(analytics, 'campaign_sent', {
  campaignId: campaign.id,
  recipientCount: 500,
  type: 'email',
});

logEvent(analytics, 'feature_used', {
  feature: 'bulk_operations',
  itemCount: 100,
});
```

### Important Events

```javascript
// User funnel
'account_created'
'first_appointment_booked'
'payment_received'
'client_retention_30d'

// Feature adoption
'feature_viewed'
'feature_used'
'feature_completed'

// Business metrics
'revenue_tracked'
'no_show_recorded'
'cancellation_recorded'

// Errors
'error_occurred'
'sync_failed'
'offline_detected'
```

### Analytics Dashboard

Use Firebase Analytics or Google Analytics 4:
- See user behavior
- Track funnel
- Identify drop-off points
- Measure feature adoption

---

## 4. Real-Time Sync Optimization (1-2 days)

### Limit Active Listeners

**Problem:** Too many listeners = memory leak + slow updates

**Solution:**
```javascript
// ❌ Bad: Creates 100 listeners
clients.forEach(client => {
  db.collection('clients').doc(client.id)
    .onSnapshot(snap => handleUpdate(snap));
});

// ✅ Good: Single query listener
db.collection('clients')
  .where('orgId', '==', orgId)
  .limit(100)
  .onSnapshot(snap => {
    snap.docs.forEach(doc => handleUpdate(doc));
  });
```

### Unsubscribe Properly

```javascript
useEffect(() => {
  // Set up listener
  const unsubscribe = db.collection('queue')
    .where('orgId', '==', orgId)
    .onSnapshot(handleQueueUpdate);

  // Clean up on unmount
  return () => unsubscribe();
}, [orgId]);
```

### Debounce Updates

```javascript
const debouncedUpdate = useMemo(
  () => debounce((data) => {
    setQueueData(data);
  }, 500),
  []
);

const handleSnapshot = (snapshot) => {
  debouncedUpdate(snapshot.docs.map(d => d.data()));
};
```

### Subscribe Only to Needed Data

```javascript
// ❌ Bad: Subscribe to everything
db.collection('appointments').onSnapshot(handleAll);

// ✅ Good: Subscribe to what you need
db.collection('appointments')
  .where('orgId', '==', orgId)
  .where('staffId', '==', staffId)
  .where('date', '>=', today)
  .onSnapshot(handleRelevantAppointments);
```

---

## 5. Batch Operations (1 day)

### Batch Writes

```javascript
const batch = db.batch();

// Add multiple documents
items.forEach(item => {
  const docRef = db.collection('items').doc();
  batch.set(docRef, item);
});

// Update multiple
clients.forEach(client => {
  batch.update(db.collection('clients').doc(client.id), {
    lastUpdated: serverTimestamp(),
  });
});

// Commit atomically (all or nothing)
await batch.commit();
```

### Benefits
- Atomic operations (all succeed or all fail)
- More efficient than individual writes
- Can batch up to 500 operations

---

## 6. Data Aggregation Scheduling (1-2 days)

### Scheduled Tasks

```javascript
// functions/tasks/dailyAggregation.js
const functions = require('firebase-functions');

exports.dailyMetricsAggregation = functions
  .pubsub
  .schedule('0 3 * * *') // 3 AM UTC
  .onRun(async () => {
    const orgs = await db.collection('organizations').get();
    
    for (const org of orgs.docs) {
      await calculateMetrics(org.data());
    }
    
    console.log('Daily aggregation complete');
  });
```

### What to Pre-calculate

- Daily metrics (bookings, revenue)
- CLV per client
- Staff performance
- Service analytics
- Cohort retention

### Cron Schedule Reference

```
"0 3 * * *"      // 3 AM daily
"0 3 * * 0"      // 3 AM Sundays
"0 0 1 * *"      // Midnight 1st of month
"0 0 */6 * *"    // Every 6 hours
```

---

## 7. Data Cleanup (1 day)

### Archive Old Data

```javascript
// Move old data to archive collection
async function archiveOldAppointments() {
  const cutoffDate = new Date();
  cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);

  const oldAppointments = await db.collection('appointments')
    .where('createdAt', '<', cutoffDate)
    .limit(100) // Batch
    .get();

  const batch = db.batch();
  oldAppointments.forEach(doc => {
    batch.set(
      db.collection('appointments_archived').doc(doc.id),
      doc.data()
    );
    batch.delete(doc.ref);
  });

  await batch.commit();
}
```

### Delete Expired Data

```javascript
// Delete soft-deleted records after 30 days
async function cleanupDeletedRecords() {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);

  const deleted = await db.collection('clients')
    .where('isDeleted', '==', true)
    .where('deletedAt', '<', cutoff)
    .get();

  const batch = db.batch();
  deleted.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
}
```

---

## Monitoring & Alerts

### Key Metrics to Monitor

| Metric | Target | Alert If |
|--------|--------|----------|
| Query latency | <500ms | >1s |
| Real-time sync lag | <1s | >2s |
| Cache hit rate | >80% | <60% |
| Error rate | <1% | >2% |

### Firebase Console Checks

- **Firestore:** Read/write operations per day
- **Cloud Functions:** Execution time, errors
- **Realtime Database:** Connection count, latency

---

## Implementation Order

**Week 1:** Query optimization + Create indexes
**Week 2:** Caching strategy + React Query tuning
**Week 3:** Event tracking + Analytics setup
**Week 4:** Real-time optimization + Data cleanup

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Avg query time | ___ | <500ms |
| Cache hit rate | ___ | >80% |
| Real-time latency | ___ | <1s |
| Firestore costs | ___ | -30% |

## Resources

- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [React Query Docs](https://tanstack.com/query/latest)
- [Firebase Analytics](https://firebase.google.com/docs/analytics)
- [Cloud Scheduler](https://cloud.google.com/scheduler/docs)
