'use client';

import { useEffect } from 'react';
import { useAuthStore } from './authStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    const unsubscribe = initAuth();

    return () => unsubscribe();
  }, [initAuth]);
  return <>{children}</>;
}
