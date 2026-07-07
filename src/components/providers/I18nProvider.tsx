'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { I18nextProvider } from 'react-i18next';
import { initI18n } from '@/lib/i18n/config';

const SUPPORTED_LANGUAGES = ['en', 'ru'] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

function getCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

export function I18nProvider({
  lng,
  children,
}: {
  lng: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const instance = initI18n(lng);

  useEffect(() => {
    if (getCookie('app_language')) return;

    const browserLng = navigator.language.split('-')[0] as SupportedLanguage;

    if (SUPPORTED_LANGUAGES.includes(browserLng) && browserLng !== 'en') {
      document.cookie = `app_language=${browserLng}; path=/; max-age=31536000; samesite=lax`;
      router.refresh();
    }
  }, [router]);

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
}
