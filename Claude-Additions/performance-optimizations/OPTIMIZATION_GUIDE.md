# Performance Optimization Guide

Systematic approach to improving app speed and efficiency.

## Quick Wins (Do First)

### 1. Image Optimization (1-2 days)
**Problem:** Images slow down initial load

**Solution:**
- Compress images (use TinyPNG, ImageOptim)
- Convert to WebP format
- Lazy load below-fold images
- Use image CDN (Firebase Hosting, Cloudflare)

**Expected impact:** 20-40% load time reduction

**Tools:** 
- `next/image` or custom `<img loading="lazy">`
- ImageMagick for batch conversion
- Firebase Hosting CDN

### 2. Bundle Analysis (1 day)
**Problem:** App JavaScript is too large

**Solution:**
- Analyze bundle with `webpack-bundle-analyzer`
- Identify large dependencies
- Split into code chunks
- Remove unused dependencies
- Tree-shake unused exports

**Expected impact:** 10-20% bundle size reduction

**Command:**
```bash
npm run build --analyze
# or use source-map-explorer
```

### 3. React Query Optimization (1-2 days)
**Problem:** Redundant API calls, stale data

**Solution:**
- Configure cache duration strategically
- Use staleTime vs. gcTime
- Prefetch data before needed
- Background refetch

**Expected impact:** Fewer API calls, faster perceived speed

### 4. Lazy Loading (1 day)
**Problem:** Loading routes/features upfront

**Solution:**
- Code split with React.lazy()
- Route-based splitting
- Component-based splitting
- Prefetch critical routes

**Expected impact:** Faster initial load

---

## Medium-Effort Optimizations

### 5. Firestore Query Optimization (2-3 days)
**Problem:** Slow database queries

**Check:**
- Are you using correct indexes?
- Are you filtering on indexed fields?
- Are you limiting results?
- Are you fetching unneeded fields?

**Solutions:**
- Create composite indexes
- Add WHERE clauses before orderBy
- Use limit()
- Use select() for specific fields

**Tools:**
- Firestore console to check index usage
- Google Cloud Console for slow queries

### 6. Database Caching (2-3 days)
**Problem:** Repeated queries to Firestore

**Solution:**
- Cache with React Query (client-side)
- Cache with Cloud Firestore persistence
- Use Cloud CDN for static content
- Session-based caching

**Expected impact:** 50%+ reduction in Firestore reads

### 7. Real-Time Sync Optimization (2-3 days)
**Problem:** Too many listeners, updates cause lag

**Solution:**
- Limit number of active listeners
- Unsubscribe when not needed
- Debounce updates
- Update only changed fields

**Expected impact:** Lower latency, less memory usage

---

## Advanced Optimizations

### 8. Worker Threads (2-3 days)
**Problem:** Heavy computation blocks UI

**Solution:**
- Move calculations to Web Workers
- Offload data processing
- Handle chart rendering in worker

### 9. Service Worker Caching (2-3 days)
**Problem:** Slow on poor connections

**Solution:**
- Cache static assets
- Offline mode for critical flows
- Background sync

### 10. CDN & Compression (1-2 days)
**Problem:** Slow global delivery

**Solution:**
- Deploy on Vercel (automatic CDN)
- Enable Gzip compression
- Use edge functions

---

## Performance Monitoring

### What to Measure

**Core Web Vitals:**
- LCP (Largest Contentful Paint) – Should be <2.5s
- FID (First Input Delay) – Should be <100ms
- CLS (Cumulative Layout Shift) – Should be <0.1

**Custom Metrics:**
- API response time
- Database query time
- Real-time sync latency
- Component render time

### Tools

- **Vercel Analytics** – Built-in monitoring
- **Firebase Performance Monitoring** – Track custom metrics
- **Lighthouse** – One-off performance audits
- **Chrome DevTools** – Local profiling
- **Bundle Analyzer** – Identify large modules

### Monitoring Setup

```javascript
// In your app, track Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

---

## Optimization Checklist

### Before Launch
- [ ] Bundle size <500KB (gzipped)
- [ ] LCP <2.5s
- [ ] FID <100ms
- [ ] Images optimized
- [ ] Lazy loading implemented
- [ ] Firestore indexes created

### Monthly Review
- [ ] Check Web Vitals trends
- [ ] Monitor API response times
- [ ] Review error rates
- [ ] Identify slowest pages
- [ ] Benchmark against competitors

### Quarterly Optimization
- [ ] Update dependencies (security + perf)
- [ ] Remove unused packages
- [ ] Optimize largest components
- [ ] Review database queries
- [ ] Test on low-end devices

---

## Key Files to Review

```
Performance-related:
- /apps/*/public/        (static assets)
- /apps/*/src/index.tsx  (main bundle)
- /functions/            (API performance)
- firebase.json          (hosting config)
- vite.config.js         (build optimization)
```

## Expected Performance Targets

| Metric | Target | Actual |
|--------|--------|--------|
| LCP | <2.5s | ___ |
| FID | <100ms | ___ |
| CLS | <0.1 | ___ |
| Bundle | <500KB | ___ |
| API latency | <500ms | ___ |
| DB query | <1s | ___ |

## Resources

- [Web Vitals Guide](https://web.dev/vitals/)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Vite Optimization Guide](https://vitejs.dev/guide/features.html)
