import { describe, it, expect, vi, beforeEach } from 'vitest';

const set = vi.fn();
const get = vi.fn();
const del = vi.fn();
vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ set, get, delete: del }),
}));

const createSessionCookie = vi.fn();
const revokeSessionCookie = vi.fn();
vi.mock('@/lib/auth/session', () => ({
  createSessionCookie: (...args: unknown[]) => createSessionCookie(...args),
  revokeSessionCookie: (...args: unknown[]) => revokeSessionCookie(...args),
  SESSION_COOKIE_NAME: '__session',
  SESSION_EXPIRES_IN_MS: 1000,
}));

import { POST, DELETE } from './route';

function makeRequest(authHeader?: string) {
  return {
    headers: {
      get: (name: string) =>
        name === 'Authorization' ? (authHeader ?? null) : null,
    },
  } as unknown as Request;
}

describe('session route POST', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 401 when no bearer token provided', async () => {
    const res = await POST(makeRequest());
    expect(res.status).toBe(401);
  });

  it('returns 401 for a non-bearer auth header', async () => {
    const res = await POST(makeRequest('Basic abc'));
    expect(res.status).toBe(401);
  });

  it('creates a session cookie on success', async () => {
    createSessionCookie.mockResolvedValue('cookie');
    const res = await POST(makeRequest('Bearer tok'));
    expect(res.status).toBe(200);
    expect(set).toHaveBeenCalled();
  });

  it('returns 401 when session cookie creation fails', async () => {
    createSessionCookie.mockRejectedValue(new Error('bad token'));
    const res = await POST(makeRequest('Bearer tok'));
    expect(res.status).toBe(401);
  });
});

describe('session route DELETE', () => {
  beforeEach(() => vi.clearAllMocks());

  it('revokes the session when a cookie exists', async () => {
    get.mockReturnValue({ value: 'cookie' });
    const res = await DELETE();
    expect(revokeSessionCookie).toHaveBeenCalledWith('cookie');
    expect(del).toHaveBeenCalled();
    expect(res.status).toBe(200);
  });

  it('does nothing extra when no cookie exists', async () => {
    get.mockReturnValue(undefined);
    const res = await DELETE();
    expect(revokeSessionCookie).not.toHaveBeenCalled();
    expect(res.status).toBe(200);
  });
});
