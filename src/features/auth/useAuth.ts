'use client';

import { useState } from 'react';
import { UseAuthResult, User } from '../../types/authTypes';

export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<User | null>(
    process.env.NEXT_PUBLIC_DEV_MOCK_AUTH
      ? { uid: 'mock-user-1', email: 'mock@test.com' }
      : null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string) => {
    setIsLoading(true);
    setUser({
      uid: 'mock-user-1',
      email,
    });
    setIsLoading(false);
  };
  const signUp = async (email: string) => {
    setUser({ uid: 'mock-user-1', email });
  };
  const signOut = async () => {
    setUser(null);
  };

  return {
    signIn,
    signOut,
    signUp,
    isLoading,
    user,
    isAuthenticated: user !== null,
  };
}
