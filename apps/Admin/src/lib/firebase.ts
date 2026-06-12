import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getDataConnect, connectDataConnectEmulator } from 'firebase/data-connect';
import { connectorConfig } from '@bridgeway/database';

const firebaseConfig = {
  projectId: "bridgeway-db29e",
  appId: "1:53861905686:web:37a545446732c3c8420c37",
  storageBucket: "bridgeway-db29e.firebasestorage.app",
  apiKey: "AIzaSyCwyyfUU3DEJAFNFoILSbT2CH8oaNMrVlk",
  authDomain: "bridgeway-db29e.firebaseapp.com",
  messagingSenderId: "53861905686",
  measurementId: "G-5W8CD2WSPL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const dataconnect = getDataConnect(app, connectorConfig);

// If running in development, connect to the emulator
// if (import.meta.env.DEV) {
//   connectDataConnectEmulator(dataconnect, 'localhost', 9399);
// }

// ── Typed callable wrappers ───────────────────────────────────────────────────

/** Starts the Google OAuth flow — returns the authorization URL to redirect to */
export const getGoogleOAuthUrl = httpsCallable<
  { orgId: string; redirectUri: string },
  { url: string }
>(functions, 'getGoogleOAuthUrl')

/** Disconnects Google Calendar from an org */
export const disconnectGoogleCalendar = httpsCallable<
  { orgId: string },
  { success: boolean }
>(functions, 'disconnectGoogleCalendar')

/** Exchanges Google OAuth code for tokens */
export const handleGoogleOAuthCallback = httpsCallable<
  { orgId: string; code: string; redirectUri: string },
  { success: boolean; refreshToken: string; accessToken: string; expiryDate: number }
>(functions, 'handleGoogleOAuthCallback')
