import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockState = {
  signIn: vi.fn(),
  signOut: vi.fn(),
  signUp: vi.fn(),
  isLoading: false,
  user: null as { uid: string; email: string } | null,
  sessionError: null,
  clearSessionError: vi.fn(),
};

vi.mock('./authStore', () => ({
  useAuthStore: () => mockState,
}));

import { useAuth } from './useAuth';

describe('useAuth', () => {
  beforeEach(() => {
    mockState.user = null;
  });

  it('reports isAuthenticated false when no user', () => {
    const result = useAuth();
    expect(result.isAuthenticated).toBe(false);
  });

  it('reports isAuthenticated true when user is set', () => {
    mockState.user = { uid: '1', email: 'a@b.com' };
    const result = useAuth();
    expect(result.isAuthenticated).toBe(true);
    expect(result.user).toEqual({ uid: '1', email: 'a@b.com' });
  });
});
