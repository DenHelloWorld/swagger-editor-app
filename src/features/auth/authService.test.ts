import { describe, it, expect, vi, beforeEach } from 'vitest';
import { syncSession, clearSession } from './authService';

describe('authService', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  describe('syncSession', () => {
    it('returns null on success', async () => {
      (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
      });
      const result = await syncSession('token');
      expect(result).toBeNull();
      expect(fetch).toHaveBeenCalledWith('/api/auth/session', {
        method: 'POST',
        headers: { Authorization: 'Bearer token' },
      });
    });

    it('returns the server error message on failure', async () => {
      (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'bad token' }),
      });
      const result = await syncSession('token');
      expect(result).toBe('bad token');
    });

    it('returns a default error message when response has no json', async () => {
      (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        json: () => Promise.reject(new Error('parse error')),
      });
      const result = await syncSession('token');
      expect(result).toBe('Failed to create session');
    });
  });

  describe('clearSession', () => {
    it('calls DELETE on the session endpoint', async () => {
      (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({});
      await clearSession();
      expect(fetch).toHaveBeenCalledWith('/api/auth/session', {
        method: 'DELETE',
      });
    });
  });
});
