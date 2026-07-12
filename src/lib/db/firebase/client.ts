'use client';

import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { firebaseConfig, isFirebaseConfigured } from './config';

function createLazySingleton<T>(factory: () => T): () => T {
  let instance: T | null = null;
  return () => {
    if (!instance) {
      instance = factory();
    }
    return instance;
  };
}

function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured()) {
    throw new Error(
      'Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* vars to .env.local',
    );
  }
  return getFirebaseAppSingleton();
}

const getFirebaseAppSingleton = createLazySingleton(() =>
  getApps().length ? getApp() : initializeApp(firebaseConfig),
);

/** Firebase Auth — sign in, sign up, sign out */
export const getFirebaseAuth = createLazySingleton(
  (): Auth => getAuth(getFirebaseApp()),
);

/** Firestore — save request history, user schemas */
export const getFirebaseFirestore = createLazySingleton(
  (): Firestore => getFirestore(getFirebaseApp()),
);
