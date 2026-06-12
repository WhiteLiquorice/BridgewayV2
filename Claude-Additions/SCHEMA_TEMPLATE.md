# Database Schema Changes Template

Use this to document all database changes needed for your feature.

## New Collections

### Collection: `collectionName`

**Purpose:** Brief description of what this collection stores

```
{
  id: string (UUID, auto-generated)
  orgId: string (foreign key to organizations)
  // ... other fields
  createdAt: timestamp (server timestamp)
  updatedAt: timestamp (server timestamp)
  isDeleted: boolean (soft delete, optional)
}
```

**Indexes:**
```
- (orgId, createdAt)      // For listing by org
- (orgId, status, date)   // For filtering by status
```

**Security Rules:**
```
match /collectionName/{document=**} {
  allow read: if request.auth.uid != null && 
              resource.data.orgId == userOrg;
  allow create: if request.auth.uid != null &&
                request.resource.data.orgId == userOrg;
  allow update: if request.auth.uid != null &&
                resource.data.orgId == userOrg;
  allow delete: if request.auth.uid != null &&
                resource.data.orgId == userOrg;
}
```

## Modified Collections

### Collection: `existingCollection`

**New Fields:**

| Field | Type | Default | Required | Notes |
|-------|------|---------|----------|-------|
| `newField1` | string | null | No | Description |
| `newField2` | number | 0 | Yes | Description |
| `newField3` | boolean | false | No | Feature flag |

**Migration Script:**

```javascript
// scripts/migrations/addNewFieldsToExistingCollection.js
async function migrate() {
  const db = admin.firestore();
  const batch = db.batch();
  
  const snapshot = await db.collection('existingCollection')
    .where('orgId', '==', 'your-org')
    .get();
  
  snapshot.docs.forEach(doc => {
    batch.update(doc.ref, {
      newField1: '',
      newField2: 0,
      newField3: false,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
  
  await batch.commit();
  console.log('Migration complete: Added new fields to existingCollection');
}
```

**Rollback Script:**

```javascript
// If needed, remove fields added by migration
async function rollback() {
  const db = admin.firestore();
  const batch = db.batch();
  
  const snapshot = await db.collection('existingCollection').get();
  
  snapshot.docs.forEach(doc => {
    batch.update(doc.ref, {
      newField1: admin.firestore.FieldValue.delete(),
      newField2: admin.firestore.FieldValue.delete(),
      newField3: admin.firestore.FieldValue.delete()
    });
  });
  
  await batch.commit();
  console.log('Rollback complete: Removed feature fields from existingCollection');
}
```

## Index Requirements

**Firestore Composite Indexes:**

```
Collection: collectionName
Index 1:
  - orgId (Ascending)
  - createdAt (Descending)
  - Status (Ascending)

Index 2:
  - orgId (Ascending)
  - status (Ascending)
  - updatedAt (Descending)
```

**Why:** These indexes support queries that filter by orgId and status while sorting by date.

## Data Validation Rules

### Field: `fieldName`

- **Type:** string
- **Min length:** 1
- **Max length:** 255
- **Pattern:** Optional regex
- **Allowed values:** Optional enum
- **Validation:** Custom logic description

## Performance Considerations

- **Data size:** Estimated collection size (e.g., 10k documents)
- **Query patterns:** Common queries and their frequency
- **Write frequency:** How often documents are updated
- **Index strategy:** Why specific indexes were chosen

## Example

If adding a new `metrics` collection for tracking user activity:

```javascript
// Purpose: Track daily engagement metrics
// Size: ~30 records per org per month (365k for 1000 orgs)
// Main queries: get metrics for date range, calculate trends

{
  id: "org-1_2024-06-15", // orgId_date for uniqueness
  orgId: "org-1",
  date: timestamp("2024-06-15"),
  appointmentsCreated: 12,
  appointmentsCompleted: 10,
  newClients: 3,
  revenue: 1200.50,
  activeStaff: 5,
  updatedAt: timestamp(server),
}

// Indexes:
// - (orgId, date DESC)       // Get metrics for date range
// - (orgId, createdAt DESC)  // Get recent metrics
```

## Testing Schema Changes

1. **Test migration** with sample org (non-production)
2. **Verify data integrity** before/after
3. **Test rollback** procedure
4. **Validate security rules** (test unauthorized access)
5. **Monitor indexes** for performance impact
6. **Confirm backward compatibility** (old code works with new schema)

## Deployment Checklist

- [ ] Migration script tested on staging
- [ ] New indexes created in production
- [ ] Security rules updated
- [ ] Rollback procedure documented and tested
- [ ] Data backed up before migration
- [ ] Indexes built (monitor Cloud Firestore dashboard)
- [ ] Queries tested with new schema
- [ ] Verified no data loss
