import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/features/auth/useAuth';
import { useSchemaStore } from '@/store/schemaStore';
import { getUserSchema } from '@/lib/db/userSchema';

export function useSchemaRestore() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const setRaw = useSchemaStore((s) => s.setRaw);
  const setFormat = useSchemaStore((s) => s.setFormat);

  const restoredForUser = useRef<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    if (isAuthLoading || !user) return;
    if (restoredForUser.current === user.uid) return;

    let cancelled = false;
    setIsRestoring(true);
    getUserSchema(user.uid)
      .then((saved) => {
        if (cancelled || !saved) return;
        setRaw(saved.content);
        setFormat(saved.format);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) {
          restoredForUser.current = user.uid;
          setIsRestoring(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user, isAuthLoading, setRaw, setFormat]);
  return { isRestoring };
}
