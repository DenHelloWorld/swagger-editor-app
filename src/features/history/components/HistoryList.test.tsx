import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { RequestRecord } from '@/types/dbTypes';

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

import HistoryList from './HistoryList';

const baseRecord: RequestRecord = {
  id: 'rec-1',
  userId: 'user-1',
  method: 'GET',
  url: 'https://petstore3.swagger.io/api/v3/pet/1',
  endpoint: '/pet/1',
  statusCode: 200,
  durationMs: 42,
  requestSize: 0,
  responseSize: 2048,
  timestamp: '2026-07-05T00:00:00.000Z',
};

describe('HistoryList', () => {
  it('renders the record count and a card per record', () => {
    render(
      <HistoryList records={[baseRecord, { ...baseRecord, id: 'rec-2' }]} />,
    );
    expect(screen.getByText('2 requests recorded')).toBeInTheDocument();
    expect(screen.getAllByText('/pet/1')).toHaveLength(2);
    expect(screen.getAllByRole('link', { name: 'Details' })).toHaveLength(2);
  });

  it('uses singular wording for a single record', () => {
    render(<HistoryList records={[baseRecord]} />);
    expect(screen.getByText('1 request recorded')).toBeInTheDocument();
  });

  it('links each record to its detail page', () => {
    render(<HistoryList records={[baseRecord]} />);
    expect(screen.getByRole('link', { name: 'Details' })).toHaveAttribute(
      'href',
      '/history/rec-1',
    );
  });

  it('shows error details only when present', () => {
    const { rerender } = render(<HistoryList records={[baseRecord]} />);
    expect(screen.queryByText('Error Details')).not.toBeInTheDocument();

    rerender(
      <HistoryList records={[{ ...baseRecord, errorDetails: 'Timeout' }]} />,
    );
    expect(screen.getByText('Error Details')).toBeInTheDocument();
    expect(screen.getByText('Timeout')).toBeInTheDocument();
  });

  it('links back to the editor', () => {
    render(<HistoryList records={[baseRecord]} />);
    expect(
      screen.getByRole('link', { name: /back to editor/i }),
    ).toHaveAttribute('href', '/');
  });
});
