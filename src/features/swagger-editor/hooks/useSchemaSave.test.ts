import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSchemaSave } from './useSchemaSave';
import { useAuth } from '@/features/auth/useAuth';
import { useSchemaStore } from '@/store/schemaStore';
import { saveUserSchema } from '@/lib/db/userSchema';
import { parseSchema, validateSchema } from '@/utils/openapi';

vi.mock('@/features/auth/useAuth');
vi.mock('@/lib/db/userSchema', () => ({ saveUserSchema: vi.fn() }));
vi.mock('@/utils/openapi', () => ({
  parseSchema: vi.fn(),
  validateSchema: vi.fn(),
}));

const initialState = useSchemaStore.getState();

function mockAuthenticatedValidSchema() {
  useSchemaStore.setState({ raw: '{}' });
  vi.mocked(useAuth).mockReturnValue({
    user: { uid: 'u1' },
    isAuthenticated: true,
  } as never);
  vi.mocked(parseSchema).mockReturnValue({
    success: true,
    doc: {},
    format: 'json',
  } as never);
  vi.mocked(validateSchema).mockResolvedValue({
    valid: true,
    doc: {},
  } as never);
}

describe('useSchemaSave', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSchemaStore.setState(initialState, true);
  });

  it('reports isValid false when errors present', () => {
    useSchemaStore.setState({ errors: ['x'], processedSpec: null });
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
    } as never);
    const { result } = renderHook(() => useSchemaSave());
    expect(result.current.isValid).toBe(false);
  });

  it('does nothing when user is not authenticated', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
    } as never);
    const { result } = renderHook(() => useSchemaSave());
    await act(async () => {
      await result.current.save();
    });
    expect(saveUserSchema).not.toHaveBeenCalled();
  });

  it('sets error status when parse fails', async () => {
    useSchemaStore.setState({ raw: 'bad' });
    vi.mocked(useAuth).mockReturnValue({
      user: { uid: 'u1' },
      isAuthenticated: true,
    } as never);
    vi.mocked(parseSchema).mockReturnValue({
      success: false,
      error: 'bad json',
    } as never);

    const { result } = renderHook(() => useSchemaSave());
    await act(async () => {
      await result.current.save();
    });
    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe('bad json');
  });

  it('sets error status when validation fails', async () => {
    useSchemaStore.setState({ raw: '{}' });
    vi.mocked(useAuth).mockReturnValue({
      user: { uid: 'u1' },
      isAuthenticated: true,
    } as never);
    vi.mocked(parseSchema).mockReturnValue({
      success: true,
      doc: {},
      format: 'json',
    } as never);
    vi.mocked(validateSchema).mockResolvedValue({
      valid: false,
      errors: ['invalid schema'],
    } as never);

    const { result } = renderHook(() => useSchemaSave());
    await act(async () => {
      await result.current.save();
    });
    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe('invalid schema');
  });

  it('saves successfully and resets status after timeout', async () => {
    vi.useFakeTimers();
    try {
      mockAuthenticatedValidSchema();
      vi.mocked(saveUserSchema).mockResolvedValue(undefined);

      const { result } = renderHook(() => useSchemaSave());
      await act(async () => {
        await result.current.save();
      });
      expect(result.current.status).toBe('success');

      await act(async () => {
        vi.advanceTimersByTime(2000);
      });
      expect(result.current.status).toBe('idle');
    } finally {
      vi.useRealTimers();
    }
  });

  it('sets error status when save throws', async () => {
    mockAuthenticatedValidSchema();
    vi.mocked(saveUserSchema).mockRejectedValue(new Error('save failed'));

    const { result } = renderHook(() => useSchemaSave());
    await act(async () => {
      await result.current.save();
    });
    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.error).toBe('save failed');
  });
});
