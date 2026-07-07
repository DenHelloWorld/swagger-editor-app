import { describe, it, expect } from 'vitest';
import { processSpec } from './processSpec';
import type { OpenAPI } from 'openapi-types';

describe('processSpec', () => {
  it('marks the version as v2 for a Swagger 2.0 document', () => {
    const doc = { swagger: '2.0', paths: {} } as unknown as OpenAPI.Document;
    expect(processSpec(doc).version).toBe('v2');
  });

  it('marks the version as v3 for an OpenAPI 3.x document', () => {
    const doc = { openapi: '3.0.0', paths: {} } as unknown as OpenAPI.Document;
    expect(processSpec(doc).version).toBe('v3');
  });

  it('groups endpoints by path and normalizes parameters/body/responses', () => {
    const doc = {
      openapi: '3.0.0',
      paths: {
        '/pets/{id}': {
          parameters: [{ name: 'id', in: 'path', schema: { type: 'string' } }],
          get: {
            summary: 'Get a pet',
            responses: { '200': { description: 'OK' } },
          },
        },
      },
    } as unknown as OpenAPI.Document;

    const result = processSpec(doc);

    expect(result.groups).toEqual([
      {
        path: '/pets/{id}',
        endpoints: [
          {
            method: 'get',
            path: '/pets/{id}',
            summary: 'Get a pet',
            description: undefined,
            parameters: [
              { name: 'id', in: 'path', schema: { type: 'string' } },
            ],
            requestBody: null,
            responses: [
              {
                statusCode: '200',
                description: 'OK',
                contentType: undefined,
                isArray: false,
                properties: [],
                example: undefined,
              },
            ],
          },
        ],
      },
    ]);
  });

  it('skips path items that are null/undefined', () => {
    const doc = {
      openapi: '3.0.0',
      paths: { '/broken': null },
    } as unknown as OpenAPI.Document;

    expect(processSpec(doc).groups).toEqual([]);
  });

  it('ignores non-HTTP-method keys on a path item (e.g. `parameters`, `summary`)', () => {
    const doc = {
      openapi: '3.0.0',
      paths: {
        '/pets': {
          summary: 'Pets collection',
          parameters: [],
        },
      },
    } as unknown as OpenAPI.Document;

    expect(processSpec(doc).groups).toEqual([{ path: '/pets', endpoints: [] }]);
  });

  it('defaults to an empty groups list when there are no paths', () => {
    const doc = { openapi: '3.0.0' } as unknown as OpenAPI.Document;
    expect(processSpec(doc).groups).toEqual([]);
  });
});
