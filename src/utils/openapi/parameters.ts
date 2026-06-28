import type { OpenAPI, OpenAPIV2 } from 'openapi-types';
import type { ResolvedParameter } from '@/types/openapi';
import { isRef } from './guards';

/** Returns `true` if the parameter is a Swagger 2.0 parameter (has a `type` field directly). */
export function isV2Param(
  p: ResolvedParameter,
): p is OpenAPIV2.InBodyParameterObject | OpenAPIV2.GeneralParameterObject {
  return 'type' in p;
}

/** Extracts the type string from a resolved parameter, handling both V2 and V3 shapes. */
export function getParamType(p: ResolvedParameter): string | undefined {
  if (isV2Param(p)) return p.type;
  return p.schema && 'type' in p.schema ? p.schema.type : undefined;
}

/**
 * Merges path-item and operation-level parameters into a single deduplicated list.
 * Operation-level parameters win on `name+in` collision.
 * Drops `$ref` entries and V2 `in: body` parameters.
 * @see https://spec.openapis.org/oas/v3.0.3.html#pathItemParameters
 */
export function mergeParameters(
  pathItemParams: OpenAPI.Parameter[],
  operationParams: OpenAPI.Parameter[],
): ResolvedParameter[] {
  const seen = new Set<string>();
  const result: ResolvedParameter[] = [];
  for (const p of [...operationParams, ...pathItemParams]) {
    if (isRef(p)) continue;
    if (p.in === 'body') continue;
    const key = `${p.name}:${p.in}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(p);
    }
  }
  return result;
}
