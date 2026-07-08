import { describe, it, expect } from 'vitest';
import {
  resolveProperties,
  resolveArrayableSchema,
  getV2RequestBody,
  getV3RequestBody,
} from './requestBody';
import type { OpenAPI } from 'openapi-types';

describe('resolveProperties', () => {
  it('returns an empty array when properties is undefined', () => {
    expect(resolveProperties(undefined)).toEqual([]);
  });

  it('flattens properties and marks required ones', () => {
    const result = resolveProperties(
      {
        name: { type: 'string', description: 'Pet name' },
        status: { type: 'string', enum: ['available', 'sold'] },
      },
      ['name'],
    );

    expect(result).toEqual([
      {
        name: 'name',
        type: 'string',
        enum: undefined,
        description: 'Pet name',
        required: true,
      },
      {
        name: 'status',
        type: 'string',
        enum: ['available', 'sold'],
        description: undefined,
        required: false,
      },
    ]);
  });
});

describe('resolveArrayableSchema', () => {
  it('unwraps `items` when the schema is an array', () => {
    const result = resolveArrayableSchema({
      type: 'array',
      items: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'integer' } },
      },
    });

    expect(result).toEqual({
      isArray: true,
      properties: [
        {
          name: 'id',
          type: 'integer',
          enum: undefined,
          description: undefined,
          required: true,
        },
      ],
      example: undefined,
    });
  });

  it('uses the schema directly when it is not an array', () => {
    const result = resolveArrayableSchema(
      { type: 'object', properties: { id: { type: 'integer' } } },
      { id: 1 },
    );

    expect(result.isArray).toBe(false);
    expect(result.example).toEqual({ id: 1 });
  });

  it('handles an undefined schema', () => {
    expect(resolveArrayableSchema(undefined)).toEqual({
      isArray: false,
      properties: [],
      example: undefined,
    });
  });
});

describe('getV2RequestBody', () => {
  it('returns null when there is no `in: body` parameter', () => {
    const op = {
      parameters: [{ name: 'id', in: 'path', type: 'string' }],
    } as OpenAPI.Operation;
    expect(getV2RequestBody(op)).toBeNull();
  });

  it('returns null when the body parameter has no schema', () => {
    const op = {
      parameters: [{ name: 'body', in: 'body' }],
    } as OpenAPI.Operation;
    expect(getV2RequestBody(op)).toBeNull();
  });

  it('resolves the body parameter schema', () => {
    const op = {
      parameters: [
        {
          name: 'body',
          in: 'body',
          schema: {
            type: 'object',
            properties: { name: { type: 'string' } },
            example: { name: 'doggie' },
          },
        },
      ],
    } as OpenAPI.Operation;

    const result = getV2RequestBody(op);

    expect(result).toEqual({
      isArray: false,
      properties: [
        {
          name: 'name',
          type: 'string',
          enum: undefined,
          description: undefined,
          required: false,
        },
      ],
      example: { name: 'doggie' },
    });
  });
});

describe('getV3RequestBody', () => {
  it('returns null when there is no requestBody', () => {
    expect(getV3RequestBody({} as OpenAPI.Operation)).toBeNull();
  });

  it('returns null when requestBody has no content entries', () => {
    const op = { requestBody: { content: {} } } as unknown as OpenAPI.Operation;
    expect(getV3RequestBody(op)).toBeNull();
  });

  it('resolves the first content entry with contentType and required', () => {
    const op = {
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: { name: { type: 'string' } },
            },
            example: { name: 'doggie' },
          },
        },
      },
    } as unknown as OpenAPI.Operation;

    const result = getV3RequestBody(op);

    expect(result).toEqual({
      contentType: 'application/json',
      required: true,
      isArray: false,
      properties: [
        {
          name: 'name',
          type: 'string',
          enum: undefined,
          description: undefined,
          required: false,
        },
      ],
      example: { name: 'doggie' },
    });
  });

  it('falls back to the schema-level example when media has none', () => {
    const op = {
      requestBody: {
        content: {
          'application/json': {
            schema: { type: 'object', example: { name: 'doggie' } },
          },
        },
      },
    } as unknown as OpenAPI.Operation;

    const result = getV3RequestBody(op);

    expect(result?.example).toEqual({ name: 'doggie' });
  });
});
