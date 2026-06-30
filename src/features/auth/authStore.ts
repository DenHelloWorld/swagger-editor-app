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
          error: '',
        });
      } else {
        set({ user: null, isLoading: false });
      }
    });
  }

  return {
    user: null,
    isLoading: true,
    error: '',

    signIn: async (email: string, password: string) => {
      set({ isLoading: true, error: '' });
      try {
        await signInWithEmailAndPassword(auth, email, password);
        return null;
      } catch (error: unknown) {
        const message = getAuthErrorMessage(error);
        set({ error: message, isLoading: false });
        return message;
      }
    },

    signUp: async (email: string, password: string) => {
      set({ isLoading: true, error: '' });
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        return null;
      } catch (error: unknown) {
        const message = getAuthErrorMessage(error);
        set({ error: message, isLoading: false });
        return message;
      }
    },

    signOut: async () => {
      set({ isLoading: true, error: '' });
      try {
        await firebaseSignOut(auth);
      } catch (error: unknown) {
        const message = getAuthErrorMessage(error);
        set({ error: message, isLoading: false });
      }
    },
  };
});
