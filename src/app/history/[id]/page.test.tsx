import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { RequestRecord } from '@/types/dbTypes';

const redirect = vi.fn<(...args: unknown[]) => never>(() => {
  throw new Error('NEXT_REDIRECT');
});
const notFound = vi.fn<(...args: unknown[]) => never>(() => {
  throw new Error('NEXT_NOT_FOUND');
});
vi.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => redirect(...args),
  notFound: (...args: unknown[]) => notFound(...args),
}));

const getUserIdFromSession = vi.fn();
vi.mock('@/lib/auth/getUserIdFromSession', () => ({
  getUserIdFromSession: () => getUserIdFromSession(),
}));

const getRequestRecordById = vi.fn();
vi.mock('@/lib/db/request-records', () => ({
  getRequestRecordById: (...args: unknown[]) => getRequestRecordById(...args),
}));

import Details from './page';

const record: RequestRecord = {
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

describe('History details page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to the main page when there is no session', async () => {
    getUserIdFromSession.mockResolvedValue(null);
    await expect(
      Details({ params: Promise.resolve({ id: 'rec-1' }) }),
    ).rejects.toThrow('NEXT_REDIRECT');
    expect(redirect).toHaveBeenCalledWith('/');
    expect(getRequestRecordById).not.toHaveBeenCalled();
  });

  it('calls notFound when the record does not exist', async () => {
    getUserIdFromSession.mockResolvedValue('user-1');
    getRequestRecordById.mockResolvedValue(null);
    await expect(
      Details({ params: Promise.resolve({ id: 'missing' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });

  it('renders the details when the record exists', async () => {
    getUserIdFromSession.mockResolvedValue('user-1');
    getRequestRecordById.mockResolvedValue(record);
    render(await Details({ params: Promise.resolve({ id: 'rec-1' }) }));
    expect(getRequestRecordById).toHaveBeenCalledWith('user-1', 'rec-1');
    expect(screen.getByText('history.detailsTitle')).toBeInTheDocument();
  });
});
