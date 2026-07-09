import { describe, it, expect, vi, beforeEach } from 'vitest';

const createSessionCookie = vi.fn();
const verifySessionCookie = vi.fn();
const revokeRefreshTokens = vi.fn();

vi.mock('@/lib/db/firebase/admin', () => ({
  getFirebaseAdminAuth: () => ({
    createSessionCookie,
    verifySessionCookie,
    revokeRefreshTokens,
  }),
}));

import {
  createSessionCookie as create,
  verifySessionCookie as verify,
  revokeSessionCookie as revoke,
} from './session';

describe('session', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a session cookie', async () => {
    createSessionCookie.mockResolvedValue('cookie-value');
    const result = await create('token');
    expect(result).toBe('cookie-value');
    expect(createSessionCookie).toHaveBeenCalledWith('token', {
      expiresIn: expect.any(Number),
    });
  });

  it('verifies a valid session cookie and returns the uid', async () => {
    verifySessionCookie.mockResolvedValue({ uid: 'user-1' });
    const result = await verify('cookie');
    expect(result).toBe('user-1');
  });

  it('returns null when verification fails', async () => {
    verifySessionCookie.mockRejectedValue(new Error('invalid'));
    const result = await verify('bad-cookie');
    expect(result).toBeNull();
  });

  it('revokes refresh tokens for a valid cookie', async () => {
    verifySessionCookie.mockResolvedValue({ uid: 'user-1' });
    revokeRefreshTokens.mockResolvedValue(undefined);
    await revoke('cookie');
    expect(revokeRefreshTokens).toHaveBeenCalledWith('user-1');
  });

  it('does nothing when revoking an invalid cookie', async () => {
    verifySessionCookie.mockRejectedValue(new Error('invalid'));
    await expect(revoke('bad')).resolves.toBeUndefined();
    expect(revokeRefreshTokens).not.toHaveBeenCalled();
  });
});
