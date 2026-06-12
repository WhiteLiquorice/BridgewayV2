# Feature Implementation Checklist Template

Use this template for each feature you're implementing. Copy to `CHECKLIST.md` in the feature folder.

## Pre-Implementation

- [ ] Read IMPLEMENTATION.md thoroughly
- [ ] Review SCHEMA.md for database changes
- [ ] Create feature branch (`git checkout -b feature/feature-name`)
- [ ] Plan database migrations (if needed)
- [ ] Identify integration points with existing code
- [ ] Check for potential conflicts with other in-progress work

## Database Setup

- [ ] Create new collections/tables
- [ ] Add indexes to Firestore (check performance impact)
- [ ] Create database migration script (if needed)
- [ ] Test migration with sample data
- [ ] Verify data integrity after migration

## Backend Implementation

- [ ] Create Cloud Function(s)
- [ ] Implement core business logic
- [ ] Add error handling and logging
- [ ] Write unit tests for logic
- [ ] Test with production-like data volumes
- [ ] Set up environment variables
- [ ] Deploy to staging environment
- [ ] Verify logs and error rates

## Frontend Implementation

- [ ] Create React components
- [ ] Implement state management (Context/Query)
- [ ] Add loading/error states
- [ ] Test responsiveness (desktop, tablet, mobile)
- [ ] Implement accessibility features (ARIA labels, keyboard nav)
- [ ] Add unit tests for components
- [ ] Test with real backend data

## Integration

- [ ] Connect frontend to backend
- [ ] Test end-to-end flow
- [ ] Verify real-time updates (if applicable)
- [ ] Check for race conditions
- [ ] Validate error handling across layers

## Performance

- [ ] Measure load time (<2s for dashboards, <500ms for updates)
- [ ] Profile database queries (check for N+1)
- [ ] Optimize bundle size (check impact)
- [ ] Test with high data volumes (10k+ records)
- [ ] Monitor Cloud Function execution time

## Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests cover happy path and error cases
- [ ] Regression tests on related features
- [ ] Manual testing across browsers (Chrome, Firefox, Safari)
- [ ] Manual testing on mobile (iOS + Android)

## Security

- [ ] Validate user permissions (org-level)
- [ ] Sanitize all inputs
- [ ] Check for data exposure
- [ ] Verify Firestore security rules updated
- [ ] Test with unauthorized user
- [ ] No sensitive data in logs

## Documentation

- [ ] Update README if user-facing
- [ ] Add inline code comments for complex logic
- [ ] Document new API endpoints (if any)
- [ ] Update CLAUDE.md if affects development workflow
- [ ] Document database schema changes

## Deployment

- [ ] Code review completed
- [ ] All tests passing
- [ ] Staging environment verified
- [ ] Create pull request with clear description
- [ ] Get approval from code reviewer
- [ ] Merge to main
- [ ] Deploy to production
- [ ] Monitor for errors in first 30 min
- [ ] Verify feature works in production

## Post-Launch

- [ ] Gather feedback from users
- [ ] Monitor performance metrics
- [ ] Check error logs for issues
- [ ] Document lessons learned
- [ ] Plan follow-up improvements
- [ ] Update analytics dashboard

## Rollback Plan (if needed)

- [ ] Identify rollback point (git commit)
- [ ] Document rollback procedure
- [ ] Test rollback in staging
- [ ] Have runbook ready
- [ ] Communicate with team before rolling back

## Success Criteria

- [ ] Feature works as designed
- [ ] No performance regression
- [ ] No new bugs in related features
- [ ] Users can easily discover and use feature
- [ ] Analytics show expected usage patterns
