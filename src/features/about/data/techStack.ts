export type TechStackItem = {
  name: string;
  url: string;
  /** Symbol id in `public/icons.svg`. */
  iconId: string;
  /** Official brand color. */
  color: string;
};

export const techStack: TechStackItem[] = [
  {
    name: 'Next.js',
    url: 'https://nextjs.org',
    iconId: 'nextjs',
    color: '#000000',
  },
  {
    name: 'React',
    url: 'https://react.dev',
    iconId: 'react',
    color: '#61dafb',
  },
  {
    name: 'TypeScript',
    url: 'https://www.typescriptlang.org',
    iconId: 'typescript',
    color: '#3178c6',
  },
  {
    name: 'Firebase',
    url: 'https://firebase.google.com',
    iconId: 'firebase',
    color: '#dd2c00',
  },
  {
    name: 'Tailwind CSS',
    url: 'https://tailwindcss.com',
    iconId: 'tailwindcss',
    color: '#06b6d4',
  },
  {
    name: 'shadcn/ui',
    url: 'https://ui.shadcn.com',
    iconId: 'shadcnui',
    color: '#000000',
  },
  {
    name: 'Vitest',
    url: 'https://vitest.dev',
    iconId: 'vitest',
    color: '#00ff74',
  },
  {
    name: 'Monaco Editor',
    url: 'https://microsoft.github.io/monaco-editor/',
    iconId: 'monaco',
    color: '#167abf',
  },
];
