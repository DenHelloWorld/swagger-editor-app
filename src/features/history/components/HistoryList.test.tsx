import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@/test/mockNextIntlServer';
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

async function renderHistoryList(records: RequestRecord[]) {
  const ui = await HistoryList({ records, locale: 'en' });
  render(ui);
}

describe('HistoryList', () => {
  it('renders the record count and a card per record', async () => {
    await renderHistoryList([baseRecord, { ...baseRecord, id: 'rec-2' }]);
    expect(screen.getByText('2 requests recorded')).toBeInTheDocument();
    expect(screen.getAllByText('/pet/1')).toHaveLength(2);
    expect(screen.getAllByRole('link', { name: 'Details' })).toHaveLength(2);
  });

  it('links each record to its detail page', async () => {
    await renderHistoryList([baseRecord]);
    expect(screen.getByRole('link', { name: 'Details' })).toHaveAttribute(
      'href',
      '/history/rec-1',
    );
  });

  it('shows error details only when present', async () => {
    await renderHistoryList([baseRecord]);
    expect(screen.queryByText('Error Details')).not.toBeInTheDocument();

    const ui = await HistoryList({
      records: [{ ...baseRecord, errorDetails: 'Timeout' }],
      locale: 'en',
    });
    render(ui);
    expect(screen.getByText('Error Details')).toBeInTheDocument();
    expect(screen.getByText('Timeout')).toBeInTheDocument();
  });

  it('links back to the editor', async () => {
    await renderHistoryList([baseRecord]);
    expect(
      screen.getByRole('link', { name: 'Back to Editor & Viewer' }),
    ).toHaveAttribute('href', '/');
  });
});
