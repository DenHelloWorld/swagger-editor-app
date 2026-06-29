import type { OpenAPI, OpenAPIV2 } from 'openapi-types';

/** Returns `true` if the document is a Swagger 2.0 spec. */
export function isSwaggerV2(doc: OpenAPI.Document): doc is OpenAPIV2.Document {
  return 'swagger' in doc;
}
