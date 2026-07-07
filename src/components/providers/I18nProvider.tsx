'use client';

import { useSyncExternalStore } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n/config';
import { Skeleton } from '@/components/ui/skeleton';

function subscribe(callback: () => void) {
  i18n.on('initialized', callback);
  return () => i18n.off('initialized', callback);
}

function getSnapshot() {
  return i18n.isInitialized;
}

function getServerSnapshot() {
  return false;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const ready = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!ready) {
    return <Skeleton className="h-16 w-full" />;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
