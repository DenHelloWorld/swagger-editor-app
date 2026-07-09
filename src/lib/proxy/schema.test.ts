// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { proxyPostRequestSchema } from './schema';

describe('proxyPostRequestSchema', () => {
  it('validates a full valid payload', () => {
    const result = proxyPostRequestSchema.safeParse({
      url: 'https://example.com',
      method: 'GET',
      headers: { Authorization: 'Bearer x' },
      body: '{}',
      endpoint: '/pet',
    });
    expect(result.success).toBe(true);
  });

  it('validates minimal valid payload', () => {
    const result = proxyPostRequestSchema.safeParse({
      url: 'https://example.com',
      method: 'GET',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid url', () => {
    const result = proxyPostRequestSchema.safeParse({
      url: 'not-a-url',
      method: 'GET',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty method', () => {
    const result = proxyPostRequestSchema.safeParse({
      url: 'https://example.com',
      method: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing url', () => {
    const result = proxyPostRequestSchema.safeParse({ method: 'GET' });
    expect(result.success).toBe(false);
  });
});
