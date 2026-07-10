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

import HistoryDetails from './HistoryDetails';

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

describe('HistoryDetails', () => {
  it('renders all analytics fields for a record', () => {
    render(<HistoryDetails record={baseRecord} />);
    expect(screen.getAllByText('/pet/1').length).toBeGreaterThan(0);
    expect(screen.getByText('42 ms')).toBeInTheDocument();
    expect(screen.getByText('2.0 KB')).toBeInTheDocument();
    expect(screen.getByText('0 B')).toBeInTheDocument();
  });

  it('shows a dash when there is no error and the value when there is one', () => {
    const { rerender } = render(<HistoryDetails record={baseRecord} />);
    expect(screen.getByText('—')).toBeInTheDocument();

    rerender(
      <HistoryDetails
        record={{ ...baseRecord, errorDetails: 'Connection refused' }}
      />,
    );
    expect(screen.getByText('Connection refused')).toBeInTheDocument();
  });

  it('links back to the history list', () => {
    render(<HistoryDetails record={baseRecord} />);
    expect(
      screen.getByRole('link', { name: 'history.backToHistory' }),
    ).toHaveAttribute('href', '/history');
  });
});
