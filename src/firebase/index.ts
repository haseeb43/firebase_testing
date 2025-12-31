
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
    let firebaseApp: FirebaseApp;
    let auth: Auth;
    let firestore: Firestore;
  if (!getApps().length) {
    // Debug: log the config we are about to initialize with
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log('[initializeFirebase] firebaseConfig:', JSON.stringify(firebaseConfig));
      } catch (err) {
        console.log('[initializeFirebase] firebaseConfig (raw):', firebaseConfig);
      }
    }

    // Basic validation: ensure required keys are present
    const missingKeys: string[] = [];
    if (!firebaseConfig || typeof firebaseConfig !== 'object') {
      throw new Error('firebaseConfig is missing or invalid. Check src/firebase/config.ts');
    }
    if (!('apiKey' in firebaseConfig)) missingKeys.push('apiKey');
    if (!('projectId' in firebaseConfig)) missingKeys.push('projectId');
    if (!('authDomain' in firebaseConfig)) missingKeys.push('authDomain');
    if (missingKeys.length) {
      throw new Error('firebaseConfig is missing required keys: ' + missingKeys.join(', '));
    }

    try {
      firebaseApp = initializeApp(firebaseConfig);
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        console.warn('Automatic initialization failed. Falling back to firebase config object.', e);
      }
      // Re-throw if config is invalid
      firebaseApp = initializeApp(firebaseConfig as any);
    }
  } else {
    firebaseApp = getApp();
  }

  auth = getAuth(firebaseApp);
  firestore = getFirestore(firebaseApp);

  return { firebaseApp, auth, firestore };
}

export * from './config';
export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './auth/app-user-provider';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
