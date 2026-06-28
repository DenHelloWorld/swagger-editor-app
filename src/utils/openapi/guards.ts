import type { OpenAPI, OpenAPIV2 } from 'openapi-types';
import type { OpenAPIRef } from '@/types/openapi';

/** Returns `true` if the document is a Swagger 2.0 spec. */
export function isSwaggerV2(doc: OpenAPI.Document): doc is OpenAPIV2.Document {
  return 'swagger' in doc;
}

/** Returns `true` if the value is a `$ref` object. */
export function isRef(p: object): p is OpenAPIRef {
  return '$ref' in p;
}
