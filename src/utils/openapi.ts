import type { OpenAPIV2, OpenAPIV3 } from 'openapi-types';
import type { OpenAPIParameter, ResolvedParameter } from '@/types/openapi';

// Returns true if the parameter is an unresolved $ref object.
export function isRef(
  p: OpenAPIParameter,
): p is OpenAPIV2.ReferenceObject | OpenAPIV3.ReferenceObject {
  return '$ref' in p;
}

// Returns true if the parameter belongs to an OpenAPI V2 document.
export function isV2Param(
  p: ResolvedParameter,
): p is OpenAPIV2.InBodyParameterObject | OpenAPIV2.GeneralParameterObject {
  return 'type' in p;
}

// Extracts the parameter type string, handling V2 (param.type) and V3 (param.schema.type).
export function getParamType(p: ResolvedParameter): string | undefined {
  if (isV2Param(p)) return p.type;
  return p.schema && 'type' in p.schema ? p.schema.type : undefined;
}

// Merges pathItem and operation parameters. Operation-level overrides pathItem-level for the same name+in combination.
// See: https://spec.openapis.org/oas/v3.0.3.html#pathItemParameters parameters field
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
