import { describe, it, expect } from 'vitest';
import { detectFormat, parseSchema } from './parseSchema';

describe('detectFormat', () => {
  it('detects JSON when the string starts with `{`', () => {
    expect(detectFormat('{"openapi": "3.0.0"}')).toBe('json');
  });

  it('detects JSON when the string starts with `[`', () => {
    expect(detectFormat('[1, 2, 3]')).toBe('json');
  });

  it('detects YAML otherwise', () => {
    expect(detectFormat('openapi: 3.0.0')).toBe('yaml');
  });

  it('ignores leading whitespace when detecting format', () => {
    expect(detectFormat('   {"openapi": "3.0.0"}')).toBe('json');
  });
});

describe('parseSchema', () => {
  it('fails on an empty string', () => {
    const result = parseSchema('   ');
    expect(result).toEqual({ success: false, error: 'Schema is empty' });
  });

  it('parses a valid JSON document', () => {
    const result = parseSchema('{"openapi": "3.0.0"}');
    expect(result).toEqual({
      success: true,
      doc: { openapi: '3.0.0' },
      format: 'json',
    });
  });

  it('parses a valid YAML document', () => {
    const result = parseSchema('openapi: 3.0.0\ninfo:\n  title: Test\n');
    expect(result).toEqual({
      success: true,
      doc: { openapi: '3.0.0', info: { title: 'Test' } },
      format: 'yaml',
    });
  });

  it('fails when the document is not an object (e.g. a bare scalar)', () => {
    const result = parseSchema('just a string');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('Schema must be a valid OpenAPI object');
    }
  });

  it('fails with a message when the input is malformed', () => {
    const result = parseSchema('{"openapi": "3.0.0"');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeTruthy();
    }
  });
});
