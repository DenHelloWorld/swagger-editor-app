import type { OpenAPIV2, OpenAPIV3 } from 'openapi-types';

/** Top-level OpenAPI document — V2 (Swagger) or V3 */
export type OpenAPIDocument = OpenAPIV2.Document | OpenAPIV3.Document;

/** Operation object for a single HTTP method on a path — V2 or V3 */
export type OpenAPIOperation =
  | OpenAPIV2.OperationObject
  | OpenAPIV3.OperationObject;

/** Path item object containing one or more operations — V2 or V3 */
export type OpenAPIPathItem =
  | OpenAPIV2.PathItemObject
  | OpenAPIV3.PathItemObject;

/**
 * Any parameter entry as it appears in the raw spec —
 * may be a concrete parameter or an unresolved `$ref`.
 * Use {@link ResolvedParameter} after filtering refs out with `isRef`.
 */
export type OpenAPIParameter =
  | OpenAPIV2.InBodyParameterObject
  | OpenAPIV2.GeneralParameterObject
  | OpenAPIV2.ReferenceObject
  | OpenAPIV3.ParameterObject
  | OpenAPIV3.ReferenceObject;

/**
 * Concrete parameter with no `$ref` — safe to access `name`, `in`, `schema`, etc.
 * Produced by `mergeParameters` after dropping all reference objects.
 */
export type ResolvedParameter =
  | OpenAPIV2.InBodyParameterObject
  | OpenAPIV2.GeneralParameterObject
  | OpenAPIV3.ParameterObject;
