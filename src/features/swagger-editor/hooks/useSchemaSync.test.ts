import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSchemaSync } from './useSchemaSync';
import { useSchemaStore } from '@/store/schemaStore';
import { parseSchema, validateSchema, processSpec } from '@/utils/openapi';
import { toast } from 'sonner';

vi.mock('@/utils/openapi', () => ({
  parseSchema: vi.fn(),
  validateSchema: vi.fn(),
  processSpec: vi.fn(),
}));
vi.mock('sonner', async () => {
  const { mockToast } = await import('@/test/mocks/sonner');
  return { toast: mockToast };
});

const initialState = useSchemaStore.getState();

describe('useSchemaSync', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useSchemaStore.setState(initialState, true);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('clears spec/errors when raw is empty', async () => {
    renderHook(() => useSchemaSync());
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(useSchemaStore.getState().processedSpec).toBeNull();
    expect(useSchemaStore.getState().errors).toEqual([]);
  });

  it('sets error when parseSchema fails', async () => {
    useSchemaStore.setState({ raw: 'bad' });
    vi.mocked(parseSchema).mockReturnValue({
      success: false,
      error: 'Invalid JSON',
    } as never);

    renderHook(() => useSchemaSync());
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(useSchemaStore.getState().errors).toEqual(['Invalid JSON']);
  });

  it('updates format when parsed format differs and sets spec on valid schema', async () => {
    useSchemaStore.setState({ raw: '{}', format: 'json' });
    vi.mocked(parseSchema).mockReturnValue({
      success: true,
      doc: { info: {} },
      format: 'yaml',
    } as never);
    vi.mocked(validateSchema).mockResolvedValue({
      valid: true,
      doc: { info: {} },
    } as never);
    vi.mocked(processSpec).mockReturnValue({
      version: 'v3',
      groups: [],
    } as never);

    renderHook(() => useSchemaSync());
    await act(async () => {
      vi.advanceTimersByTime(500);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(useSchemaStore.getState().format).toBe('yaml');
    expect(useSchemaStore.getState().processedSpec).toEqual({
      version: 'v3',
      groups: [],
    });
  });

  it('sets errors when validation reports invalid schema', async () => {
    useSchemaStore.setState({ raw: '{}', format: 'json' });
    vi.mocked(parseSchema).mockReturnValue({
      success: true,
      doc: {},
      format: 'json',
    } as never);
    vi.mocked(validateSchema).mockResolvedValue({
      valid: false,
      errors: ['bad schema'],
    } as never);

    renderHook(() => useSchemaSync());
    await act(async () => {
      vi.advanceTimersByTime(500);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(useSchemaStore.getState().errors).toEqual(['bad schema']);
  });

  it('shows toast once when validation throws unexpectedly', async () => {
    useSchemaStore.setState({ raw: '{}', format: 'json' });
    vi.mocked(parseSchema).mockReturnValue({
      success: true,
      doc: {},
      format: 'json',
    } as never);
    vi.mocked(validateSchema).mockRejectedValue(new Error('boom'));

    renderHook(() => useSchemaSync());
    await act(async () => {
      vi.advanceTimersByTime(500);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(useSchemaStore.getState().errors).toEqual([
      'Validation is temporarily unavailable',
    ]);
  });
});
