import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTryItOut } from './useTryItOut';
import type { ProcessedEndpoint } from '@/types/openapi';

const endpoint: ProcessedEndpoint = {
  method: 'post',
  path: '/pet/{id}',
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
    } as ProcessedEndpoint['parameters'][number],
    {
      name: 'limit',
      in: 'query',
      required: false,
    } as ProcessedEndpoint['parameters'][number],
  ],
  requestBody: {
    isArray: false,
    properties: [],
    example: { name: 'fido' },
  },
  responses: [],
};

describe('useTryItOut', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes bodyValue from requestBody example', () => {
    const { result } = renderHook(() => useTryItOut(endpoint));
    expect(result.current.bodyValue).toBe(
      JSON.stringify({ name: 'fido' }, null, 2),
    );
    expect(result.current.hasBody).toBe(true);
  });

  it('sets error when baseUrl is invalid on execute', async () => {
    const { result } = renderHook(() => useTryItOut(endpoint));
    await act(async () => {
      await result.current.execute();
    });
    expect(result.current.error).toBe('Please enter a valid Server URL');
  });

  it('executes request successfully and parses json body', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ok: true }),
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useTryItOut(endpoint));
    act(() => {
      result.current.setBaseUrl('https://api.example.com');
      result.current.setParamValue('id', '1');
    });

    await act(async () => {
      await result.current.execute();
    });

    await waitFor(() => {
      expect(result.current.response).not.toBeNull();
    });
    expect(result.current.response?.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/proxy',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('sets error when response is not ok', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Bad request' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useTryItOut(endpoint));
    act(() => {
      result.current.setBaseUrl('https://api.example.com');
    });

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.error).toBe('Bad request');
  });

  it('sets error when fetch throws', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('network down')),
    );

    const { result } = renderHook(() => useTryItOut(endpoint));
    act(() => {
      result.current.setBaseUrl('https://api.example.com');
    });

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.error).toBe('network down');
  });

  it('generateCurl throws when baseUrl invalid', () => {
    const { result } = renderHook(() => useTryItOut(endpoint));
    expect(() => result.current.generateCurl()).toThrow(
      'Please enter a valid Server URL',
    );
  });

  it('keeps raw body when response body is not valid json', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: 200,
        headers: {},
        body: 'not-json',
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useTryItOut(endpoint));
    act(() => {
      result.current.setBaseUrl('https://api.example.com');
      result.current.setParamValue('id', '1');
    });

    await act(async () => {
      await result.current.execute();
    });

    await waitFor(() => expect(result.current.response).not.toBeNull());
    expect(result.current.response?.body).toBe('not-json');
  });

  it('falls back to error field when errorDetails missing', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Generic error' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useTryItOut(endpoint));
    act(() => {
      result.current.setBaseUrl('https://api.example.com');
    });

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.error).toBe('Generic error');
  });

  it('handles a GET endpoint without body support', () => {
    const getEndpoint: ProcessedEndpoint = {
      method: 'get',
      path: '/pet',
      parameters: [],
      requestBody: null,
      responses: [],
    };
    const { result } = renderHook(() => useTryItOut(getEndpoint));
    expect(result.current.hasBody).toBe(false);
    expect(result.current.bodyValue).toBe('');
  });

  it('generateCurl builds curl command with valid baseUrl', () => {
    const { result } = renderHook(() => useTryItOut(endpoint));
    act(() => {
      result.current.setBaseUrl('https://api.example.com');
      result.current.setParamValue('id', '1');
    });
    const curl = result.current.generateCurl();
    expect(curl).toContain('curl -X POST');
  });
});
