# Bulk Operations

**Effort:** 2 days | **Impact:** Medium | **Priority:** 7

## Overview

Perform operations on multiple records at once: bulk email, reschedule appointments, archive services, etc.

## Features

- **Bulk Email** – Send email to selected clients
- **Bulk Schedule** – Reschedule multiple appointments
- **Bulk Tag** – Add tags to multiple clients
- **Bulk Archive** – Archive multiple services/inventory items
- **Bulk Update** – Update properties on multiple records

## Implementation

### Step 1: Selection UI (Day 1)
- Add checkboxes to list pages (Clients, Appointments, Inventory)
- Show count of selected items
- Add action menu with bulk operations

### Step 2: Bulk Action Handler (Day 1)
Create `/functions/bulk/bulkOperations.js`:
```javascript
async function bulkUpdate(orgId, collection, ids, updateData) {
  // Batch update up to 500 records
  // Validate permissions for each record
  // Return success/failure per record
}
```

### Step 3: Backend APIs (Day 1-2)
- POST `/api/bulk/email` – Send bulk emails
- POST `/api/bulk/update` – Update multiple records
- POST `/api/bulk/delete` – Delete multiple records (soft delete)
- POST `/api/bulk/tag` – Add tags to multiple records

### Step 4: Confirmation & Progress (Day 2)
- Confirmation dialog before bulk action
- Progress indicator for large operations
- Error summary after completion

## Testing Checklist

- [ ] Can select multiple items
- [ ] Bulk actions update correctly
- [ ] Handles 1000+ items
- [ ] Validates permissions
- [ ] Shows progress feedback
- [ ] Error handling (partial failures)

## Files to Create

```
/functions/
  bulk/
    bulkOperations.js (new)
    
/apps/Admin/src/
  hooks/
    useBulkSelection.ts (new)
  components/
    BulkActionBar.tsx (new)
```
