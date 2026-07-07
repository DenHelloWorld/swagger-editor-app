'use client';

import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n/config';
import { Skeleton } from '@/components/ui/skeleton';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(i18n.isInitialized);

  useEffect(() => {
    if (!i18n.isInitialized) {
      i18n.on('initialized', () => setReady(true));
    }
  }, []);

  if (!ready) {
    return <Skeleton className="h-16 w-full" />;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
