'use client';

import { AuthState } from '@/types/authTypes';
import { create } from 'zustand';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/db/firebase/client';

const auth = getFirebaseAuth();
export const useAuthStore = create<AuthState>((set) => {
  if (
    typeof window !== 'undefined' &&
    process.env.NEXT_PUBLIC_DEV_MOCK_AUTH !== 'true'
  ) {
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        set({
          user: {
            uid: firebaseUser.uid,
            email: firebaseUser.email ?? '',
          },
          isLoading: false,
        });
      } else {
        set({ user: null, isLoading: false });
      }
    });
  }
  return {
    user:
      process.env.NEXT_PUBLIC_DEV_MOCK_AUTH === 'true'
        ? { uid: 'mock-user-1', email: 'mock@test.com' }
        : null,
    isLoading: process.env.NEXT_PUBLIC_DEV_MOCK_AUTH !== 'true',

    signIn: async (email: string, password: string) => {
      set({ isLoading: true });
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch {
        //TODO toast to notify user
        set({ isLoading: false });
      }
    },

    signUp: async (email: string, password: string) => {
      set({ isLoading: true });
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch {
        //TODO toast to notify user
        set({ isLoading: false });
      }
    },

    signOut: async () => {
      set({ isLoading: true });
      try {
        await firebaseSignOut(auth);
        if (process.env.NEXT_PUBLIC_DEV_MOCK_AUTH === 'true') {
          set({ user: null, isLoading: false });
        }
      } catch {
        //TODO toast to notify user
        set({ isLoading: false });
      }
    },
  };
});
