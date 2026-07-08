import type { TeamMember } from '../types';

/**
 * Each teammate adds their own entry here.
 * `role`/`bio` are personal free text, so each member provides both an `en`
 * and `ru` copy directly instead of routing through the `about` i18n namespace.
 */
export const team: TeamMember[] = [
  {
    name: 'Denis Saveliev',
    role: {
      en: 'Swagger Viewer & API Integration',
      ru: 'Swagger Viewer и интеграция с API',
    },
    bio: {
      en: 'Built the Swagger Viewer, CORS proxy, Try-It-Out, and cURL generator, with unit test coverage throughout.',
      ru: 'Разработал Swagger Viewer, CORS-прокси, Try-It-Out и генератор cURL, с покрытием юнит-тестами.',
    },
    githubUrl: 'https://github.com/DenHelloWorld',
    linkedinUrl: 'https://www.linkedin.com/in/denis-saveliev-b216a7269/',
  },
  {
    name: 'Svetlana Angeliuk',
    role: {
      en: 'Auth, History & Infrastructure',
      ru: 'Аутентификация, история и инфраструктура',
    },
    bio: {
      en: 'Set up project infrastructure, db, delivered the app header, footer, sign-in/sign-up flow, and server-side History & Analytics pages.',
      ru: 'Настроила инфраструктуру проекта и БД, реализовала шапку, подвал, формы входа/регистрации и серверные страницы истории и аналитики.',
    },
    githubUrl: 'https://github.com/SwetlanaAng',
    linkedinUrl: 'https://www.linkedin.com/in/svetlana-angeliuk-827233308/',
  },
  {
    name: 'Alena Danilchenko',
    role: {
      en: 'Swagger Editor & i18n',
      ru: 'Редактор Swagger и локализация',
    },
    bio: {
      en: 'Built the Swagger Editor with JSON/YAML support and validation, i18n, sticky header, and app-wide error handling.',
      ru: 'Разработала Swagger Editor с поддержкой JSON/YAML и валидацией, локализацию, липкую шапку и обработку ошибок приложения.',
    },
    githubUrl: 'https://github.com/anelka777',
    linkedinUrl: 'https://www.linkedin.com/in/alena-danilchenko/',
  },
];
