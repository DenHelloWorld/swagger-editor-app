import type { TeamMember } from '../types';

/**
 * Each teammate adds their own entry here.
 * `role`/`bio` are personal free text, not covered by the `aboutContent` i18n
 * dictionary — if/when locales land, each member localizes their own copy.
 */
export const team: TeamMember[] = [
  {
    name: 'Denis Saveliev',
    role: 'Swagger Viewer & API Integration',
    bio: 'Built the Swagger Viewer, CORS proxy, Try-It-Out, and cURL generator, with unit test coverage throughout.',
    githubUrl: 'https://github.com/DenHelloWorld',
    linkedinUrl: 'https://www.linkedin.com/in/denis-saveliev-b216a7269/',
  },
  {
    name: 'Svetlana Angeliuk',
    role: 'Auth, History & Infrastructure',
    bio: 'Set up project infrastructure, db, delivered the app header, footer, sign-in/sign-up flow, and server-side History & Analytics pages.',
    githubUrl: 'https://github.com/SwetlanaAng',
    linkedinUrl: 'https://www.linkedin.com/in/svetlana-angeliuk-827233308/',
  },
];
