import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from './page';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

describe('About page', () => {
  it('renders sections, tech stack, and team', () => {
    render(<About />);
    expect(screen.getByText('about.title')).toBeInTheDocument();
    expect(screen.getByText('about.builtWithTitle')).toBeInTheDocument();
    expect(screen.getByText('about.teamTitle')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });
});
