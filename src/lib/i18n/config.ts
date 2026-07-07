'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ru from './locales/ru.json';

export function initI18n(lng: string) {
  if (!i18n.isInitialized) {
    i18n.use(initReactI18next).init({
      lng,
      resources: {
        en: { translation: en },
        ru: { translation: ru },
      },
      fallbackLng: 'en',
      supportedLngs: ['en', 'ru'],
      interpolation: { escapeValue: false },
    });
  } else if (i18n.language !== lng) {
    i18n.changeLanguage(lng);
  }
  return i18n;
}

export default i18n;
