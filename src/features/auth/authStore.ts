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
import { clearSession, syncSession } from '@/features/auth/authService';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  sessionError: null,

  clearSessionError: () => set({ sessionError: null }),

  initAuth: () => {
    try {
      const auth = getFirebaseAuth();
      return onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const idToken = await firebaseUser.getIdToken();
          const sessionError = await syncSession(idToken);

          if (sessionError) {
            await firebaseSignOut(auth);
            set({ user: null, isLoading: false, sessionError });
            return;
          }

          set({
            user: {
              uid: firebaseUser.uid,
              email: firebaseUser.email ?? '',
            },
            isLoading: false,
            sessionError: null,
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
    set({ sessionError: null });
    const auth = getFirebaseAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return null;
    } catch (error: unknown) {
      return getAuthErrorMessage(error);
    }
  },

  signUp: async (email: string, password: string) => {
    set({ sessionError: null });
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
      await clearSession();
      await firebaseSignOut(auth);
      return null;
    } catch (error: unknown) {
      set({ isLoading: false });
      return getAuthErrorMessage(error);
    }
  },
}));
