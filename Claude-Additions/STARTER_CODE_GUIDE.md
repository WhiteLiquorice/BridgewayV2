# Starter Code Templates

This folder contains reusable code templates for common patterns in Bridgeway V2 features.

## Available Templates

### 1. Cloud Function Template
**File:** `cloudFunction.template.js`

Use for any backend logic:
- Database CRUD operations
- Data processing
- External API integration
- Scheduled tasks

**Copy to:** `/functions/yourFeature/yourFunction.js`

**Usage:**
```bash
cp STARTER_CODE/cloudFunction.template.js ../functions/yourFeature/yourFunction.js
# Then customize the function signature and logic
```

### 2. React Component Template
**File:** `ReactComponent.template.tsx`

Use for UI components:
- Loading states
- Error boundaries
- Data fetching
- User interactions

**Copy to:** `/apps/AppName/src/components/YourComponent.tsx`

**Includes:**
- Error handling
- Loading skeleton
- TypeScript types
- React Query integration (optional)

### 3. React Page Template
**File:** `ReactPage.template.tsx`

Use for full pages with multiple sections:
- Data fetching
- Navigation
- Multiple components
- Responsive layout

**Copy to:** `/apps/AppName/src/pages/YourPage.tsx`

### 4. Firestore Query Hook
**File:** `useFirestoreQuery.template.ts`

Reusable React Hook for querying Firestore:
- Real-time listeners
- Caching
- Error handling
- Loading states

**Usage:**
```tsx
const { data, loading, error } = useFirestoreQuery('collectionName', {
  where: [['orgId', '==', orgId]],
  orderBy: [['createdAt', 'desc']],
  limit: 50
});
```

### 5. Analytics Event Tracker
**File:** `analyticsTracker.template.ts`

Track user events for analytics:
- Page views
- Feature usage
- Conversions
- Errors

**Usage:**
```typescript
import { trackEvent } from '@/lib/analytics';

trackEvent('feature_used', {
  featureName: 'bulk_operations',
  itemCount: 10
});
```

### 6. Data Aggregation Function
**File:** `dataAggregation.template.js`

For calculating metrics, summaries, reports:
- Batch processing
- Aggregations
- Trend calculation
- Statistical analysis

**Usage in Cloud Functions:**
```javascript
const metrics = await aggregateMetrics(orgId, dateRange);
// Returns: { total, average, trend, distribution }
```

### 7. API Endpoint Handler
**File:** `apiEndpoint.template.js`

Express-like HTTP function handlers:
- Request validation
- Authentication
- Response formatting
- Error handling

**Copy to:** `/functions/api/yourEndpoint.js`

### 8. Form Component Template
**File:** `FormComponent.template.tsx`

For data entry forms:
- Validation
- Error messages
- Loading states
- Success feedback

### 9. Table/List Component Template
**File:** `TableComponent.template.tsx`

For displaying data in tables:
- Sorting
- Filtering
- Pagination
- Row actions

### 10. Modal/Dialog Component
**File:** `ModalComponent.template.tsx`

Reusable dialog/modal:
- Open/close states
- Content flexibility
- Confirmation
- Error handling

## Template Customization Tips

### 1. Find and Replace
After copying, do a global find/replace:
- `TemplateComponent` → `YourComponentName`
- `templateFunction` → `yourFunctionName`
- `template` → `yourFeatureName`

### 2. Remove Unused Code
- Delete sections you don't need (loading skeletons, error boundaries, etc.)
- Keep only what your feature requires
- Delete TODO comments

### 3. Update Imports
- Update paths to match your directory structure
- Add actual Firestore collection names
- Import your specific types

### 4. Add Your Logic
- Implement business logic in placeholders
- Add validation rules
- Configure API calls

## Code Standards to Maintain

### TypeScript
```typescript
// Always define types
interface ComponentProps {
  data: DataType[];
  onSelect: (id: string) => void;
  loading?: boolean;
}

// Export both default and named
export default function Component({ data }: ComponentProps) { }
```

### React Components
```typescript
// Use functional components with hooks
// Destructure props at top
// Use proper key props in lists
// Handle null/undefined data gracefully
```

### Cloud Functions
```javascript
// Validate inputs
// Log important operations
// Return consistent response format
// Handle errors gracefully
// Use async/await consistently
```

### Error Handling
```typescript
// Always show user-friendly error messages
// Log detailed errors for debugging
// Provide recovery options (retry, go back)
// Don't expose internal error details
```

### Performance
```typescript
// Memoize expensive calculations
// Use lazy loading for images
// Limit queries with pagination
// Cache computed values
```

## Testing Your Template

Before using a template, verify:

1. **Compilation** – Does it compile/lint without errors?
2. **Imports** – Are all imports valid?
3. **Types** – Are TypeScript types correct?
4. **Logic** – Does placeholder logic make sense?
5. **Integration** – Does it work with existing code?

## Quick Start Example

Creating a new feature dashboard:

```bash
# 1. Copy page template
cp STARTER_CODE/ReactPage.template.tsx ../apps/Admin/src/pages/NewFeature.tsx

# 2. Copy component template for chart
cp STARTER_CODE/ReactComponent.template.tsx ../apps/Admin/src/components/NewFeatureChart.tsx

# 3. Copy query hook
cp STARTER_CODE/useFirestoreQuery.template.ts ../apps/Admin/src/hooks/useNewFeatureData.ts

# 4. Copy analytics tracker
cp STARTER_CODE/analyticsTracker.template.ts ../apps/Admin/src/lib/newFeatureAnalytics.ts

# 5. Find and replace template names in all files
# 6. Customize each file for your feature
# 7. Add to routing and navigation
# 8. Test
```

## Template Directory Structure

```
STARTER_CODE/
  cloudFunction.template.js
  ReactComponent.template.tsx
  ReactPage.template.tsx
  useFirestoreQuery.template.ts
  analyticsTracker.template.ts
  dataAggregation.template.js
  apiEndpoint.template.js
  FormComponent.template.tsx
  TableComponent.template.tsx
  ModalComponent.template.tsx
  styles.template.css (optional Tailwind patterns)
```

## Getting Help

If you're unclear on how to customize a template:

1. Check the IMPLEMENTATION.md for the feature
2. Look for similar existing code in the codebase
3. Review existing components in `/apps/*/src/components/`
4. Check CLAUDE.md for codebase conventions

## Contributing New Templates

If you create a useful pattern, add it to `STARTER_CODE/`:

1. Generalize the code (replace specific names with placeholders)
2. Add TODO comments for customization points
3. Include JSDoc/TypeDoc comments
4. Update this guide
5. Add to the template list above
