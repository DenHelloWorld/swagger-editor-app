import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import en from '@/lib/i18n/locales/en.json';

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

function getNestedValue(source: Record<string, unknown>, key: string): unknown {
  return key.split('.').reduce<unknown>((value, part) => {
    if (value && typeof value === 'object' && part in value) {
      return (value as Record<string, unknown>)[part];
    }
    return undefined;
  }, source);
}

vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn(),
  getTranslations: async ({
    namespace,
  }: {
    locale: string;
    namespace: keyof typeof en;
  }) => {
    const messages = en[namespace] as Record<string, unknown>;

    return (key: string) => {
      const value = getNestedValue(messages, key);
      return typeof value === 'string' ? value : key;
    };
  },
}));

import EmptyHistory from './EmptyHistory';

describe('EmptyHistory', () => {
  it('shows the empty state message and a link back to the editor', async () => {
    const ui = await EmptyHistory({ locale: 'en' });
    render(ui);
    expect(
      screen.getByText("You haven't executed any requests yet."),
    ).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'Go to Editor & Viewer' });
    expect(link).toHaveAttribute('href', '/');
  });
});
