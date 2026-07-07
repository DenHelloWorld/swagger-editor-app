import { describe, it, expect } from 'vitest';
import { isV2Param, getParamType, mergeParameters } from './parameters';
import type { ResolvedParameter } from '@/types/openapi';

describe('isV2Param', () => {
  it('returns true for a V2 parameter (has `type` directly)', () => {
    const p = { name: 'id', in: 'path', type: 'string' } as ResolvedParameter;
    expect(isV2Param(p)).toBe(true);
  });

  it('returns false for a V3 parameter (type lives under `schema`)', () => {
    const p = {
      name: 'id',
      in: 'path',
      schema: { type: 'string' },
    } as ResolvedParameter;
    expect(isV2Param(p)).toBe(false);
  });
});

describe('getParamType', () => {
  it('extracts the type from a V2 parameter', () => {
    const p = {
      name: 'id',
      in: 'path',
      type: 'integer',
    } as ResolvedParameter;
    expect(getParamType(p)).toBe('integer');
  });

  it('extracts the type from a V3 parameter schema', () => {
    const p = {
      name: 'id',
      in: 'path',
      schema: { type: 'integer' },
    } as ResolvedParameter;
    expect(getParamType(p)).toBe('integer');
  });

  it('returns undefined when the V3 schema has no type', () => {
    const p = { name: 'id', in: 'path', schema: {} } as ResolvedParameter;
    expect(getParamType(p)).toBeUndefined();
  });

  it('returns undefined when the V3 parameter has no schema', () => {
    const p = { name: 'id', in: 'path' } as ResolvedParameter;
    expect(getParamType(p)).toBeUndefined();
  });
});

describe('mergeParameters', () => {
  it('merges path-item and operation-level parameters', () => {
    const pathItemParams = [
      { name: 'id', in: 'path', type: 'string' },
    ] as ResolvedParameter[];
    const operationParams = [
      { name: 'limit', in: 'query', type: 'integer' },
    ] as ResolvedParameter[];

    const result = mergeParameters(pathItemParams, operationParams);

    expect(result).toEqual([
      { name: 'limit', in: 'query', type: 'integer' },
      { name: 'id', in: 'path', type: 'string' },
    ]);
  });

  it('lets operation-level parameters win on name+in collision', () => {
    const pathItemParams = [
      { name: 'id', in: 'path', type: 'string', description: 'from path item' },
    ] as ResolvedParameter[];
    const operationParams = [
      { name: 'id', in: 'path', type: 'string', description: 'from operation' },
    ] as ResolvedParameter[];

    const result = mergeParameters(pathItemParams, operationParams);

    expect(result).toEqual([
      { name: 'id', in: 'path', type: 'string', description: 'from operation' },
    ]);
  });

  it('drops V2 `in: body` parameters', () => {
    const operationParams = [
      { name: 'body', in: 'body', schema: {} },
    ] as ResolvedParameter[];

    const result = mergeParameters([], operationParams);

    expect(result).toEqual([]);
  });
});
