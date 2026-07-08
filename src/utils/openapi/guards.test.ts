import { describe, it, expect } from 'vitest';
import { isSwaggerV2 } from './guards';
import type { OpenAPI } from 'openapi-types';

describe('isSwaggerV2', () => {
  it('returns true for a Swagger 2.0 document', () => {
    const doc = { swagger: '2.0', paths: {} } as unknown as OpenAPI.Document;
    expect(isSwaggerV2(doc)).toBe(true);
  });

  it('returns false for an OpenAPI 3.x document', () => {
    const doc = { openapi: '3.0.0', paths: {} } as unknown as OpenAPI.Document;
    expect(isSwaggerV2(doc)).toBe(false);
  });
});
