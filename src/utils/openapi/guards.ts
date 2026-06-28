import type { OpenAPI, OpenAPIV2, OpenAPIV3_1 } from 'openapi-types';
import type { OpenAPIRef } from '@/types/openapi';

/** Returns `true` if the document is a Swagger 2.0 spec. */
export function isSwaggerV2(doc: OpenAPI.Document): doc is OpenAPIV2.Document {
  return 'swagger' in doc;
}

/** Returns `true` if the document is an OpenAPI 3.1.x spec. */
export function isOpenAPIV31(
  doc: OpenAPI.Document,
): doc is OpenAPIV3_1.Document {
  return (
    'openapi' in doc && (doc as OpenAPIV3_1.Document).openapi.startsWith('3.1')
  );
}

/** Returns `true` if the value is a `$ref` object. */
export function isRef(p: object): p is OpenAPIRef {
  return '$ref' in p;
}
