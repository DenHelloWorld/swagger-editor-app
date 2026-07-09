import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useSchemaRestore } from './useSchemaRestore';
import { useAuth } from '@/features/auth/useAuth';
import { useSchemaStore } from '@/store/schemaStore';
import { getUserSchema } from '@/lib/db/userSchema';
import { toast } from 'sonner';

vi.mock('@/features/auth/useAuth');
vi.mock('@/lib/db/userSchema', () => ({ getUserSchema: vi.fn() }));
vi.mock('sonner', async () => {
  const { mockToast } = await import('@/test/mocks/sonner');
  return { toast: mockToast };
});

const initialState = useSchemaStore.getState();

describe('useSchemaRestore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSchemaStore.setState(initialState, true);
  });

  it('does nothing while auth is loading', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: true,
    } as never);
    const { result } = renderHook(() => useSchemaRestore());
    expect(result.current.isRestoring).toBe(false);
    expect(getUserSchema).not.toHaveBeenCalled();
  });

  it('does nothing when there is no user', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: false,
    } as never);
    renderHook(() => useSchemaRestore());
    expect(getUserSchema).not.toHaveBeenCalled();
  });

  it('restores schema for authenticated user', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uid: 'u1' },
      isLoading: false,
    } as never);
    vi.mocked(getUserSchema).mockResolvedValue({
      content: 'raw content',
      format: 'yaml',
      userId: 'u1',
      updatedAt: '2026-01-01',
    } as never);

    const { result } = renderHook(() => useSchemaRestore());
    await waitFor(() => expect(result.current.isRestoring).toBe(false));

    expect(useSchemaStore.getState().raw).toBe('raw content');
    expect(useSchemaStore.getState().format).toBe('yaml');
  });

  it('shows toast on failure', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uid: 'u1' },
      isLoading: false,
    } as never);
    vi.mocked(getUserSchema).mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => useSchemaRestore());
    await waitFor(() => expect(result.current.isRestoring).toBe(false));
    expect(toast.error).toHaveBeenCalled();
  });

  it('does not restore twice for the same user', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { uid: 'u1' },
      isLoading: false,
    } as never);
    vi.mocked(getUserSchema).mockResolvedValue(null);

    const { result, rerender } = renderHook(() => useSchemaRestore());
    await waitFor(() => expect(result.current.isRestoring).toBe(false));
    rerender();
    expect(getUserSchema).toHaveBeenCalledTimes(1);
  });
});
