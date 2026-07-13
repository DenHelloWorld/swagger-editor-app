'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { I18nextProvider } from 'react-i18next';
import { initI18n } from '@/lib/i18n/config';
import { getCookie, setCookie } from '@/lib/cookies';

const SUPPORTED_LANGUAGES = ['en', 'ru'] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

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
      setCookie('app_language', browserLng);
      router.refresh();
    }
  }, [router]);

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
}
