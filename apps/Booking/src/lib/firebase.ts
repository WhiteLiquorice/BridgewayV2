import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getFunctions, httpsCallable } from 'firebase/functions'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db   = getFirestore(app)
export const fns  = getFunctions(app)

// ── Typed callable wrappers ───────────────────────────────────────────────────

/** Returns busy time ranges from the org's connected Google Calendar for a given date */
export const getCalendarAvailability = httpsCallable<
  { orgId: string; date: string },
  { busySlots: { start: string; end: string }[] }
>(fns, 'getCalendarAvailability')

/** Creates a Google Calendar event when a booking is confirmed */
export const createCalendarEvent = httpsCallable<
  { bookingId: string },
  { eventId: string; htmlLink: string }
>(fns, 'createCalendarEvent')

/** Starts the Google OAuth flow — returns the authorization URL to redirect to */
export const getGoogleOAuthUrl = httpsCallable<
  { orgId: string; redirectUri: string },
  { url: string }
>(fns, 'getGoogleOAuthUrl')

/** Exchanges an OAuth code for tokens and stores them on the org document */
export const handleGoogleOAuthCallback = httpsCallable<
  { orgId: string; code: string; redirectUri: string },
  { success: boolean }
>(fns, 'handleGoogleOAuthCallback')

/** Disconnects Google Calendar from an org */
export const disconnectGoogleCalendar = httpsCallable<
  { orgId: string },
  { success: boolean }
>(fns, 'disconnectGoogleCalendar')
