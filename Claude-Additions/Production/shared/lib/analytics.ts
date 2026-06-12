/**
 * Event tracking wrapper. (Data & Analytics → Event Tracking)
 * Thin layer over Firebase Analytics so call sites stay clean and events
 * stay consistently named.
 */
import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';

type EventName =
  | 'page_view'
  | 'feature_used'
  | 'appointment_booked'
  | 'appointment_completed'
  | 'campaign_created'
  | 'campaign_sent'
  | 'bulk_operation'
  | 'report_generated'
  | 'gift_card_issued'
  | 'gift_card_redeemed'
  | 'feedback_submitted'
  | 'error_occurred';

let analyticsReady: ReturnType<typeof getAnalytics> | null = null;
let initPromise: Promise<void> | null = null;

async function ensureAnalytics(): Promise<void> {
  if (analyticsReady || initPromise) return initPromise ?? Promise.resolve();
  initPromise = isSupported().then((ok) => {
    if (ok) analyticsReady = getAnalytics();
  });
  return initPromise;
}

/** Fire-and-forget event logging; never throws. */
export function trackEvent(name: EventName, params: Record<string, string | number | boolean> = {}): void {
  ensureAnalytics()
    .then(() => {
      if (analyticsReady) logEvent(analyticsReady, name as string, params);
    })
    .catch(() => {
      /* analytics unavailable (ad blocker, unsupported env) — ignore */
    });
}

/** Convenience: track page views from a router effect. */
export function trackPageView(path: string): void {
  trackEvent('page_view', { page_path: path });
}

/** Convenience: standardized error tracking. */
export function trackError(context: string, message: string): void {
  trackEvent('error_occurred', { context, message: message.slice(0, 100) });
}
