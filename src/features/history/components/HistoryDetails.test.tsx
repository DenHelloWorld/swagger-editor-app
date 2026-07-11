import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import en from '@/lib/i18n/locales/en.json';
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

async function renderHistoryDetails(record: RequestRecord) {
  const ui = await HistoryDetails({ record, locale: 'en' });
  render(ui);
}

describe('HistoryDetails', () => {
  it('renders all analytics fields for a record', async () => {
    await renderHistoryDetails(baseRecord);
    expect(screen.getAllByText('/pet/1').length).toBeGreaterThan(0);
    expect(screen.getByText('42 ms')).toBeInTheDocument();
    expect(screen.getByText('2.0 KB')).toBeInTheDocument();
    expect(screen.getByText('0 B')).toBeInTheDocument();
  });

  it('shows a dash when there is no error and the value when there is one', async () => {
    await renderHistoryDetails(baseRecord);
    expect(screen.getByText('—')).toBeInTheDocument();

    const ui = await HistoryDetails({
      record: { ...baseRecord, errorDetails: 'Connection refused' },
      locale: 'en',
    });
    render(ui);
    expect(screen.getByText('Connection refused')).toBeInTheDocument();
  });

  it('links back to the history list', async () => {
    await renderHistoryDetails(baseRecord);
    expect(
      screen.getByRole('link', { name: 'Back to History' }),
    ).toHaveAttribute('href', '/history');
  });
});
