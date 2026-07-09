// @vitest-environment node
import { describe, it, expect } from 'vitest';
import {
  formatTimestamp,
  formatBytes,
  getStatusVariant,
  getMethodVariant,
} from './recordFormat';

describe('formatTimestamp', () => {
  it('formats an ISO timestamp using locale string', () => {
    const result = formatTimestamp('2026-07-05T00:00:00.000Z');
    expect(result).toBe(new Date('2026-07-05T00:00:00.000Z').toLocaleString());
  });
});

describe('formatBytes', () => {
  it('renders sub-1024 byte counts as bytes', () => {
    expect(formatBytes(512)).toBe('512 B');
  });

  it('renders byte counts at or above 1024 as KB', () => {
    expect(formatBytes(2048)).toBe('2.0 KB');
  });
});

describe('getStatusVariant', () => {
  it('returns success for 2xx', () => {
    expect(getStatusVariant(200)).toBe('success');
  });

  it('returns destructive for 4xx and 5xx', () => {
    expect(getStatusVariant(404)).toBe('destructive');
    expect(getStatusVariant(500)).toBe('destructive');
  });

  it('returns secondary for other status codes', () => {
    expect(getStatusVariant(301)).toBe('secondary');
  });
});

describe('getMethodVariant', () => {
  it('returns secondary for GET', () => {
    expect(getMethodVariant('get')).toBe('secondary');
  });

  it('returns default for POST/PUT/PATCH', () => {
    expect(getMethodVariant('POST')).toBe('default');
    expect(getMethodVariant('PUT')).toBe('default');
    expect(getMethodVariant('PATCH')).toBe('default');
  });

  it('returns outline for other methods', () => {
    expect(getMethodVariant('DELETE')).toBe('outline');
  });
});
