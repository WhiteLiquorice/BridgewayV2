import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';

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
