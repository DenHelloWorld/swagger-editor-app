import { describe, it, expect, vi } from 'vitest';
import { validateSchema } from './validateSchema';
import SwaggerParser from '@apidevtools/swagger-parser';
import type { OpenAPI } from 'openapi-types';

vi.mock('@apidevtools/swagger-parser', () => ({
  default: { validate: vi.fn() },
}));

describe('validateSchema', () => {
  it('returns the dereferenced document when validation succeeds', async () => {
    const resolvedDoc = { openapi: '3.0.0', paths: {} };
    vi.mocked(SwaggerParser.validate).mockResolvedValue(
      resolvedDoc as unknown as OpenAPI.Document,
    );

    const result = await validateSchema({
      openapi: '3.0.0',
    } as OpenAPI.Document);

    expect(result).toEqual({ valid: true, doc: resolvedDoc });
  });

  it('returns errors when validation throws an Error', async () => {
    vi.mocked(SwaggerParser.validate).mockRejectedValue(
      new Error('missing required field "info"'),
    );

    const result = await validateSchema({} as OpenAPI.Document);

    expect(result).toEqual({
      valid: false,
      errors: ['missing required field "info"'],
    });
  });

  it('falls back to a generic message when the thrown value is not an Error', async () => {
    vi.mocked(SwaggerParser.validate).mockRejectedValue('not an error object');

    const result = await validateSchema({} as OpenAPI.Document);

    expect(result).toEqual({ valid: false, errors: ['Invalid schema'] });
  });
});
