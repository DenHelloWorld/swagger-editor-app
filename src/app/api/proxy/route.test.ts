// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';

const getUserIdFromSession = vi.fn();
vi.mock('@/lib/auth/getUserIdFromSession', () => ({
  getUserIdFromSession: (...args: unknown[]) => getUserIdFromSession(...args),
}));

const saveRequestRecord = vi.fn();
vi.mock('@/lib/db/request-records', () => ({
  saveRequestRecord: (...args: unknown[]) => saveRequestRecord(...args),
}));

import { POST } from './route';

function makeRequest(body: unknown, invalidJson = false) {
  return {
    json: () =>
      invalidJson ? Promise.reject(new Error('bad')) : Promise.resolve(body),
  } as unknown as import('next/server').NextRequest;
}

describe('proxy route POST', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', vi.fn());
    getUserIdFromSession.mockResolvedValue(null);
  });

  it('returns 400 for invalid JSON body', async () => {
    const res = await POST(makeRequest(null, true));
    expect(res.status).toBe(400);
  });

  it('returns 400 for a body failing schema validation', async () => {
    const res = await POST(makeRequest({ url: 'not-a-url' }));
    expect(res.status).toBe(400);
  });

  it('proxies a successful request and returns the response', async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 200,
      headers: {
        forEach: (cb: (v: string, k: string) => void) =>
          cb('application/json', 'content-type'),
      },
      text: () => Promise.resolve('{"ok":true}'),
    });
    const res = await POST(
      makeRequest({
        url: 'https://api.example.com/pets',
        method: 'GET',
        headers: { host: 'x', 'X-Api': 'v' },
      }),
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe(200);
    expect(json.body).toBe('{"ok":true}');
  });

  it('records history for authenticated users on success', async () => {
    getUserIdFromSession.mockResolvedValue('user-1');
    saveRequestRecord.mockResolvedValue(undefined);
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 200,
      headers: { forEach: () => {} },
      text: () => Promise.resolve(''),
    });
    await POST(
      makeRequest({ url: 'https://api.example.com/pets', method: 'GET' }),
    );
    expect(saveRequestRecord).toHaveBeenCalled();
  });

  it('does not throw when history save fails', async () => {
    getUserIdFromSession.mockResolvedValue('user-1');
    saveRequestRecord.mockRejectedValue(new Error('db down'));
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 200,
      headers: { forEach: () => {} },
      text: () => Promise.resolve(''),
    });
    const res = await POST(
      makeRequest({ url: 'https://api.example.com/pets', method: 'GET' }),
    );
    expect(res.status).toBe(200);
  });

  it('returns 502 when the external fetch fails', async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('network down'),
    );
    const res = await POST(
      makeRequest({
        url: 'https://api.example.com/pets',
        method: 'POST',
        body: '{"a":1}',
      }),
    );
    expect(res.status).toBe(502);
  });
});
