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
import { getAuthErrorMessage } from '@/features/auth/utils/getAuthErrorMessage';

const auth = getFirebaseAuth();

export const useAuthStore = create<AuthState>((set) => {
  if (typeof window !== 'undefined') {
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
    user: null,
    isLoading: true,

    signIn: async (email: string, password: string) => {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        return null;
      } catch (error: unknown) {
        return getAuthErrorMessage(error);
      }
    },

    signUp: async (email: string, password: string) => {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        return null;
      } catch (error: unknown) {
        return getAuthErrorMessage(error);
      }
    },

    signOut: async () => {
      set({ isLoading: true });
      try {
        await firebaseSignOut(auth);
        return null;
      } catch (error: unknown) {
        set({ isLoading: false });
        return getAuthErrorMessage(error);
      }
    },
  };
});
