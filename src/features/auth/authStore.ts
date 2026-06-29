'use client';

import { AuthState } from '@/types/authTypes';
import { create } from 'zustand';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/db/firebase/client';

const auth = getFirebaseAuth();
export const useAuthStore = create<AuthState>((set) => ({
  user:
    process.env.NEXT_PUBLIC_DEV_MOCK_AUTH === 'true'
      ? { uid: 'mock-user-1', email: 'mock@test.com' }
      : null,
  isLoading: false,

  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true });
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      set({
        user: {
          uid: user.uid,
          email,
        },
      });
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      set({
        user: {
          uid: user.uid,
          email,
        },
      });
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
      set({ user: null });
    } catch {
      //TODO toast to notify user
    } finally {
      set({ isLoading: false });
    }
  },
}));
