import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration for Accounticca HRMS (project: hraccounticca)
export const firebaseConfig = {
  apiKey: 'AIzaSyCYgXndYV2ZaFapS9kL2VXsFKpSR0YMthM',
  authDomain: 'hraccounticca.firebaseapp.com',
  projectId: 'hraccounticca',
  storageBucket: 'hraccounticca.firebasestorage.app',
  messagingSenderId: '228917642067',
  appId: '1:228917642067:web:3043cbc1386be41b1cd7a6',
  measurementId: 'G-6MNWHDH3BV',
};

// Initialize Firebase (singleton-safe for HMR)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics safely in supported browser environments
export let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      analytics = null;
    });
}

