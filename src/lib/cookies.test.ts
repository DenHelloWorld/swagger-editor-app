import { describe, it, expect, beforeEach } from 'vitest';
import { setCookie, getCookie } from './cookies';

function clearCookies() {
  document.cookie.split(';').forEach((c) => {
    const name = c.split('=')[0].trim();
    if (name) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  });
}

describe('cookies', () => {
  beforeEach(() => {
    clearCookies();
  });

  it('sets and gets a cookie', () => {
    setCookie('token', 'abc123');
    expect(getCookie('token')).toBe('abc123');
  });

  it('returns undefined for missing cookie', () => {
    expect(getCookie('missing')).toBeUndefined();
  });

  it('decodes url-encoded cookie values', () => {
    setCookie('name', 'a b/c');
    expect(getCookie('name')).toBe('a b/c');
  });

  it('handles multiple cookies and picks the right one', () => {
    setCookie('a', '1');
    setCookie('b', '2');
    expect(getCookie('a')).toBe('1');
    expect(getCookie('b')).toBe('2');
  });
});
