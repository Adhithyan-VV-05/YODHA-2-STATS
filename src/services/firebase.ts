import { initializeApp, getApps, getApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export function getStoredFirebaseConfig(): FirebaseConfig | null {
  const stored = localStorage.getItem('yodha_firebase_config');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  const envConfig: FirebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  };

  if (envConfig.apiKey && envConfig.projectId) {
    return envConfig;
  }

  return null;
}

export function initFirebaseApp(customConfig?: FirebaseConfig): { app: FirebaseApp | null; db: Firestore | null } {
  const config = customConfig || getStoredFirebaseConfig();
  
  if (!config || !config.apiKey || !config.projectId) {
    return { app: null, db: null };
  }

  try {
    const app = !getApps().length ? initializeApp(config) : getApp();
    const db = getFirestore(app);
    return { app, db };
  } catch (error) {
    console.warn('Firebase initialization warning:', error);
    return { app: null, db: null };
  }
}
