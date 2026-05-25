import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
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
export const functions = getFunctions(app);
export const dataconnect = getDataConnect(app, connectorConfig);

export const createCalendarEvent = httpsCallable<{ bookingId: string }, { success: boolean, eventId?: string, eventLink?: string, error?: string }>(functions, 'createCalendarEvent');

// If running in development, connect to the emulator
// if (import.meta.env.DEV) {
//   connectDataConnectEmulator(dataconnect, 'localhost', 9399);
// }
