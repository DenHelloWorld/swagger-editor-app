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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  initAuth: () => {
    try {
      const auth = getFirebaseAuth();
      return onAuthStateChanged(auth, (firebaseUser) => {
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
    } catch {
      set({ user: null, isLoading: false });
      return () => {};
    }
  },

  signIn: async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return null;
    } catch (error: unknown) {
      return getAuthErrorMessage(error);
    }
  },

  signUp: async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return null;
    } catch (error: unknown) {
      return getAuthErrorMessage(error);
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    const auth = getFirebaseAuth();
    try {
      await firebaseSignOut(auth);
      return null;
    } catch (error: unknown) {
      set({ isLoading: false });
      return getAuthErrorMessage(error);
    }
  },
}));
