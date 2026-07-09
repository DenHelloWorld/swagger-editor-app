import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { RequestRecord } from '@/types/dbTypes';

const redirect = vi.fn<(...args: unknown[]) => never>(() => {
  throw new Error('NEXT_REDIRECT');
});
vi.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => redirect(...args),
}));

const getUserIdFromSession = vi.fn();
vi.mock('@/lib/auth/getUserIdFromSession', () => ({
  getUserIdFromSession: () => getUserIdFromSession(),
}));

const getRequestRecords = vi.fn();
vi.mock('@/lib/db/request-records', () => ({
  getRequestRecords: (...args: unknown[]) => getRequestRecords(...args),
}));

import History from './page';

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

describe('History page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to the main page when there is no session', async () => {
    getUserIdFromSession.mockResolvedValue(null);
    await expect(History()).rejects.toThrow('NEXT_REDIRECT');
    expect(redirect).toHaveBeenCalledWith('/');
    expect(getRequestRecords).not.toHaveBeenCalled();
  });

  it('renders the empty state when there are no records', async () => {
    getUserIdFromSession.mockResolvedValue('user-1');
    getRequestRecords.mockResolvedValue([]);
    render(await History());
    expect(
      screen.getByText("You haven't executed any requests yet."),
    ).toBeInTheDocument();
  });

  it('renders the list when records exist', async () => {
    getUserIdFromSession.mockResolvedValue('user-1');
    getRequestRecords.mockResolvedValue([record]);
    render(await History());
    expect(screen.getByText('1 request recorded')).toBeInTheDocument();
    expect(getRequestRecords).toHaveBeenCalledWith('user-1');
  });
});
