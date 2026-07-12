import { hasLocale } from 'next-intl';
import en from '@/lib/i18n/locales/en.json';
import ru from '@/lib/i18n/locales/ru.json';

export const locales = ['en', 'ru'] as const;
export type Locale = (typeof locales)[number];
export type Messages = typeof en;

export const defaultLocale: Locale = 'en';

const messagesByLocale: Record<Locale, Messages> = { en, ru };

export function getValidLocale(value: string | undefined): Locale {
  if (value !== undefined && hasLocale(locales, value)) {
    return value;
  }

  return defaultLocale;
}

export function getMessagesForLocale(locale: Locale): Messages {
  return messagesByLocale[locale];
}

export function isHistoryPath(pathname: string) {
  return pathname === '/history' || pathname.startsWith('/history/');
}
