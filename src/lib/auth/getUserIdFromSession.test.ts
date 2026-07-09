import { describe, it, expect, vi, beforeEach } from 'vitest';

const get = vi.fn();
vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get }),
}));

const verifySessionCookie = vi.fn();
vi.mock('./session', () => ({
  SESSION_COOKIE_NAME: '__session',
  verifySessionCookie: (...args: unknown[]) => verifySessionCookie(...args),
}));

import { getUserIdFromSession } from './getUserIdFromSession';

describe('getUserIdFromSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when no session cookie is present', async () => {
    get.mockReturnValue(undefined);
    const result = await getUserIdFromSession();
    expect(result).toBeNull();
    expect(verifySessionCookie).not.toHaveBeenCalled();
  });

  it('returns the verified user id when a cookie is present', async () => {
    get.mockReturnValue({ value: 'cookie-value' });
    verifySessionCookie.mockResolvedValue('user-1');
    const result = await getUserIdFromSession();
    expect(result).toBe('user-1');
    expect(verifySessionCookie).toHaveBeenCalledWith('cookie-value');
  });
});
