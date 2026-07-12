import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@/test/mockNextIntlServer';

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
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
