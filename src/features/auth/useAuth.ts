'use client';

import { useState } from 'react';

interface useAuthResult {
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string) => Promise<void>;
  isLoading: boolean;
  user: userSchema | null;
  isAuthenticated: boolean;
}
interface userSchema {
  uid: string;
  email: string;
}
export function useAuth(): useAuthResult {
  const [user, setUser] = useState<userSchema | null>(
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
