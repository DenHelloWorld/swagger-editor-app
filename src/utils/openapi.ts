import type { OpenAPIV2, OpenAPIV3 } from 'openapi-types';
import type { OpenAPIParameter, ResolvedParameter } from '@/types/openapi';

/**
 * @param {OpenAPIParameter} p - OpenAPI parameter or reference object
 * @returns {boolean} `true` if `p` is an unresolved `$ref` object
 */
export function isRef(
  p: OpenAPIParameter,
): p is OpenAPIV2.ReferenceObject | OpenAPIV3.ReferenceObject {
  return '$ref' in p;
}

/**
 * @param {ResolvedParameter} p - resolved OpenAPI parameter (no `$ref`)
 * @returns {boolean} `true` if `p` belongs to an OpenAPI V2 document
 */
export function isV2Param(
  p: ResolvedParameter,
): p is OpenAPIV2.InBodyParameterObject | OpenAPIV2.GeneralParameterObject {
  return 'type' in p;
}

/**
 * @param {ResolvedParameter} p - resolved OpenAPI parameter (no `$ref`)
 * @returns {string | undefined} type string — `p.type` for V2, `p.schema.type` for V3, or `undefined` if absent
 */
export function getParamType(p: ResolvedParameter): string | undefined {
  if (isV2Param(p)) return p.type;
  return p.schema && 'type' in p.schema ? p.schema.type : undefined;
}

/**
 * Merges path-item and operation parameters; operation-level wins on `name+in` collision.
 * @see https://spec.openapis.org/oas/v3.0.3.html#pathItemParameters
 * @param {OpenAPIParameter[]} pathItemParams - parameters defined on the path item object
 * @param {OpenAPIParameter[]} operationParams - parameters defined on the individual operation
 * @returns {ResolvedParameter[]} deduplicated list of resolved parameters (`$ref` entries are dropped)
 */
export function mergeParameters(
  pathItemParams: OpenAPIParameter[],
  operationParams: OpenAPIParameter[],
): ResolvedParameter[] {
  const seen = new Set<string>();
  const result: ResolvedParameter[] = [];

  for (const p of [...operationParams, ...pathItemParams]) {
    if (isRef(p)) continue;

    const key = `${p.name}:${p.in}`;

    if (!seen.has(key)) {
      seen.add(key);
      result.push(p);
    }
  }

  return result;
}
