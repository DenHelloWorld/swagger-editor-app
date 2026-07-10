import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

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
  it('shows the empty state message and a link back to the editor', () => {
    render(<EmptyHistory />);
    expect(screen.getByText('history.emptyTitle')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'history.goToEditor' });
    expect(link).toHaveAttribute('href', '/');
  });
});
