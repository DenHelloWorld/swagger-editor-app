import { describe, it, expect } from 'vitest';
import { getV2Responses, getV3Responses } from './responses';
import type { OpenAPI } from 'openapi-types';

describe('getV2Responses', () => {
  it('returns an empty array when there are no responses', () => {
    expect(getV2Responses({} as OpenAPI.Operation)).toEqual([]);
  });

  it('normalizes each response by status code', () => {
    const op = {
      responses: {
        '200': {
          description: 'OK',
          schema: {
            type: 'object',
            properties: { id: { type: 'integer' } },
            example: { id: 1 },
          },
        },
        '404': { description: 'Not found' },
      },
    } as unknown as OpenAPI.Operation;

    const result = getV2Responses(op);

    expect(result).toEqual([
      {
        statusCode: '200',
        description: 'OK',
        isArray: false,
        properties: [
          {
            name: 'id',
            type: 'integer',
            enum: undefined,
            description: undefined,
            required: false,
          },
        ],
        example: { id: 1 },
      },
      {
        statusCode: '404',
        description: 'Not found',
        isArray: false,
        properties: [],
        example: undefined,
      },
    ]);
  });
});

describe('getV3Responses', () => {
  it('returns an empty array when there are no responses', () => {
    expect(getV3Responses({} as OpenAPI.Operation)).toEqual([]);
  });

  it('normalizes each response with contentType from the first content entry', () => {
    const op = {
      responses: {
        '200': {
          description: 'OK',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { type: 'object', properties: {} },
              },
              example: [1, 2],
            },
          },
        },
      },
    } as unknown as OpenAPI.Operation;

    const result = getV3Responses(op);

    expect(result).toEqual([
      {
        statusCode: '200',
        description: 'OK',
        contentType: 'application/json',
        isArray: true,
        properties: [],
        example: [1, 2],
      },
    ]);
  });

  it('handles a response with no content', () => {
    const op = {
      responses: { default: { description: 'Unexpected error' } },
    } as unknown as OpenAPI.Operation;

    const result = getV3Responses(op);

    expect(result).toEqual([
      {
        statusCode: 'default',
        description: 'Unexpected error',
        contentType: undefined,
        isArray: false,
        properties: [],
        example: undefined,
      },
    ]);
  });
});
