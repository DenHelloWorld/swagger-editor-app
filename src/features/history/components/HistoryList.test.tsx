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
    expect(screen.getByText('history.recordCount')).toBeInTheDocument();
    expect(screen.getAllByText('/pet/1')).toHaveLength(2);
    expect(
      screen.getAllByRole('link', { name: 'history.details' }),
    ).toHaveLength(2);
  });

  it('links each record to its detail page', () => {
    render(<HistoryList records={[baseRecord]} />);
    expect(
      screen.getByRole('link', { name: 'history.details' }),
    ).toHaveAttribute('href', '/history/rec-1');
  });

  it('shows error details only when present', () => {
    const { rerender } = render(<HistoryList records={[baseRecord]} />);
    expect(
      screen.queryByText('history.fields.errorDetails'),
    ).not.toBeInTheDocument();

    rerender(
      <HistoryList records={[{ ...baseRecord, errorDetails: 'Timeout' }]} />,
    );
    expect(screen.getByText('history.fields.errorDetails')).toBeInTheDocument();
    expect(screen.getByText('Timeout')).toBeInTheDocument();
  });

  it('links back to the editor', () => {
    render(<HistoryList records={[baseRecord]} />);
    expect(
      screen.getByRole('link', { name: 'history.backToEditor' }),
    ).toHaveAttribute('href', '/');
  });
});
