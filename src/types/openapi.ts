import type { OpenAPIV2, OpenAPIV3 } from 'openapi-types';

/** Discriminated spec version derived from the document root (`swagger`/`openapi` field). */
export type SpecVersion = 'v2' | 'v3';

/** Path item object containing one or more operations — V2 or V3. */
export type OpenAPIPathItem =
  | OpenAPIV2.PathItemObject
  | OpenAPIV3.PathItemObject;

/**
 * Concrete parameter — safe to access `name`, `in`, `schema`, etc.
 * Produced by `mergeParameters` after deduplication and dropping V2 body params.
 */
export type ResolvedParameter =
  | OpenAPIV2.InBodyParameterObject
  | OpenAPIV2.GeneralParameterObject
  | OpenAPIV3.ParameterObject;

/** A single schema property normalized by `resolveProperties` — `$ref` entries are already excluded. */
export type ProcessedSchemaProperty = {
  name: string;
  type?: string;
  enum?: string[];
  description?: string;
  /** `true` if the property name appears in the parent schema's `required` array. */
  required: boolean;
};

/**
 * Normalized request body produced by `getV2RequestBody` / `getV3RequestBody`.
 * V2 bodies omit `contentType` and `required`; V3 bodies always have `contentType`.
 */
export type ProcessedRequestBody = {
  /** MIME type of the first `content` entry (V3 only). */
  contentType?: string;
  /** Whether the request body is required (V3 only). */
  required?: boolean;
  isArray: boolean;
  /** Flattened, `$ref`-free list of schema properties ready for rendering. */
  properties: ProcessedSchemaProperty[];
  example?: object;
};

/** A single normalized response entry produced by `getV2Responses` / `getV3Responses`. */
export type ProcessedResponse = {
  statusCode: string;
  description?: string;
  /** MIME type of the first `content` entry (V3 only). */
  contentType?: string;
  isArray: boolean;
  /** Flattened, `$ref`-free list of schema properties ready for rendering. */
  properties: ProcessedSchemaProperty[];
  example?: object;
};

/** A single API endpoint normalized from a path item operation. */
export type ProcessedEndpoint = {
  method: string;
  path: string;
  summary?: string;
  description?: string;
  /** Deduplicated, `$ref`-free parameters — produced by `mergeParameters`. */
  parameters: ResolvedParameter[];
  requestBody: ProcessedRequestBody | null;
  responses: ProcessedResponse[];
};

/** All endpoints under a single path, grouped for rendering by `processSpec`. */
export type ProcessedGroup = {
  path: string;
  endpoints: ProcessedEndpoint[];
};

/** The full normalized output of `processSpec` — ready for the viewer to render without touching the raw doc. */
export type ProcessedSpec = {
  version: SpecVersion;
  groups: ProcessedGroup[];
};
