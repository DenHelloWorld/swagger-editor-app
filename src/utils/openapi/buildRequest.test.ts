import { describe, it, expect } from 'vitest';
import { buildUrl, buildHeaders, buildCurlCommand } from './buildRequest';
import type { ResolvedParameter } from '@/types/openapi';

describe('buildUrl', () => {
  it('substitutes path params and appends query params', () => {
    const params = [
      { name: 'id', in: 'path' },
      { name: 'limit', in: 'query' },
    ] as ResolvedParameter[];

    const url = buildUrl(
      'https://api.example.com',
      '/pets/{id}',
      { id: '42', limit: '10' },
      params,
    );

    expect(url).toBe('https://api.example.com/pets/42?limit=10');
  });

  it('omits query params without a value', () => {
    const params = [{ name: 'limit', in: 'query' }] as ResolvedParameter[];

    const url = buildUrl('https://api.example.com', '/pets', {}, params);

    expect(url).toBe('https://api.example.com/pets');
  });
});

describe('buildHeaders', () => {
  it('builds header params and merges cookies into a Cookie header', () => {
    const params = [
      { name: 'X-Api-Key', in: 'header' },
      { name: 'session', in: 'cookie' },
      { name: 'theme', in: 'cookie' },
    ] as ResolvedParameter[];

    const headers = buildHeaders(
      { 'X-Api-Key': 'secret', session: 'abc', theme: 'dark' },
      params,
    );

    expect(headers).toEqual({
      'X-Api-Key': 'secret',
      Cookie: 'session=abc; theme=dark',
    });
  });

  it('returns an empty object when no header/cookie values are set', () => {
    expect(buildHeaders({}, [])).toEqual({});
  });
});

describe('buildCurlCommand', () => {
  it('builds a GET command with headers', () => {
    const curl = buildCurlCommand('get', 'https://api.example.com/pets/42', {
      'X-Api-Key': 'secret',
    });

    expect(curl).toBe(
      "curl -X GET 'https://api.example.com/pets/42' -H 'X-Api-Key: secret'",
    );
  });

  it('includes a --data flag when a body is present', () => {
    const curl = buildCurlCommand(
      'POST',
      'https://api.example.com/pets',
      { 'Content-Type': 'application/json' },
      '{"name":"Rex"}',
    );

    expect(curl).toBe(
      "curl -X POST 'https://api.example.com/pets' -H 'Content-Type: application/json' --data '{\"name\":\"Rex\"}'",
    );
  });

  it('escapes single quotes in the url and body', () => {
    const curl = buildCurlCommand(
      'GET',
      "https://api.example.com/search?q=it's",
      {},
    );

    expect(curl).toBe(
      "curl -X GET 'https://api.example.com/search?q=it'\\''s'",
    );
  });
});
