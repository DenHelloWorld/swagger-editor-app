'use client';

import { UseAuthResult } from '@/types/authTypes';
import { useAuthStore } from './authStore';

export function useAuth(): UseAuthResult {
  const {
    signIn,
    signOut,
    signUp,
    isLoading,
    user,
    sessionError,
    clearSessionError,
  } = useAuthStore();

  return {
    signIn,
    signOut,
    signUp,
    isLoading,
    user,
    sessionError,
    clearSessionError,
    isAuthenticated: user !== null,
  };
}
