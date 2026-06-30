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
    isLoading: false,

    signIn: async (email: string, password: string) => {
      try {
        set({ isLoading: true });
        await signInWithEmailAndPassword(auth, email, password);
      } catch {
        /*     const errorCode = error.code;
      const errorMessage = error.message; */
        //TODO toast to notify user
      } finally {
        set({ isLoading: false });
      }
    },

    signUp: async (email: string, password: string) => {
      try {
        set({ isLoading: true });
        await createUserWithEmailAndPassword(auth, email, password);
      } catch {
        /*     const errorCode = error.code;
      const errorMessage = error.message; */
        //TODO toast to notify user
      } finally {
        set({ isLoading: false });
      }
    },

    signOut: async () => {
      set({ isLoading: true });
      try {
        await firebaseSignOut(auth);
      } catch {
        //TODO toast to notify user
      } finally {
        set({ isLoading: false });
      }
    },
  };
});
