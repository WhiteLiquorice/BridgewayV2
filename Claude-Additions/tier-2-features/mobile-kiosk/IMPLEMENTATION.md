# Mobile Kiosk Responsiveness

**Effort:** 3 days | **Impact:** Medium | **Priority:** 10

## Overview

Ensure Kiosk app works perfectly on tablets and mobile devices (portrait and landscape).

## Features

- **Responsive layouts** – Works on 7" tablet to 55" touchscreen
- **Touch-friendly buttons** – Large, easy-to-tap targets
- **Orientation detection** – Handles rotation smoothly
- **Offline support** – Queue data cached locally
- **High contrast** – Readable in bright sunlight
- **Font scaling** – Adjusts for distance from screen

## Implementation Steps

### Day 1: Responsive Design Audit
- Test on multiple devices (7", 10", 15" screens)
- Check orientation handling
- Test with landscape/portrait
- Verify button sizes (touch targets 44px minimum)
- Check text readability

### Day 2: Layout Fixes
- Update Tailwind grid layouts
- Add responsive font sizes
- Improve spacing for touch
- Add orientation listeners
- Test rotation smoothness

### Day 3: Polish & Testing
- Test on actual devices
- Verify offline mode
- Test with slow connections
- Performance on low-end devices
- Battery usage optimization

## Testing Checklist

- [ ] Works on 7" tablet in portrait and landscape
- [ ] Works on 10" tablet
- [ ] Works on typical kiosk screen (17-24")
- [ ] Touch targets at least 44x44px
- [ ] Rotation is smooth (no layout shift)
- [ ] Readable in bright light
- [ ] Works offline
- [ ] No performance issues on older devices

## Files to Modify

```
/apps/Kiosk/src/
  components/
    KioskLayout.tsx (responsive grid)
    CheckInForm.tsx (touch-friendly inputs)
    QueueDisplay.tsx (large, readable)
    
/apps/Kiosk/tailwind.config.js (responsive config)
```

## Key Metrics

- Load time: <2s on 3G
- Button tap accuracy: 95%+
- Rotation time: <500ms
- Battery usage: Minimal
