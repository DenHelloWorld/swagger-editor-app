'use client';

import { UseAuthResult } from '@/types/authTypes';
import { useAuthStore } from './authStore';

export function useAuth(): UseAuthResult {
  const { signIn, signOut, signUp, isLoading, user, error } = useAuthStore();

  return {
    signIn,
    signOut,
    signUp,
    isLoading,
    user,
    error,
    isAuthenticated: user !== null,
  };
}
