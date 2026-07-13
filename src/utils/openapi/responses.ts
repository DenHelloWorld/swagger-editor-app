import type { OpenAPI, OpenAPIV2, OpenAPIV3 } from 'openapi-types';
import type { ProcessedResponse } from '@/types/openapi';
import type { AnySchemaObject } from '@/types/openapi';
import { resolveArrayableSchema } from './requestBody';

export function getV2Responses(
  operation: OpenAPI.Operation,
): ProcessedResponse[] {
  const responses = (operation as OpenAPIV2.OperationObject).responses;
  if (!responses) return [];

  return Object.entries(responses).map(([statusCode, res]) => {
    const r = res as OpenAPIV2.ResponseObject;
    const schema = r.schema as
      | (OpenAPIV2.SchemaObject & { example?: object })
      | undefined;
    return {
      statusCode,
      description: r.description,
      ...resolveArrayableSchema(schema as AnySchemaObject, schema?.example),
    };
  });
}

export function getV3Responses(
  operation: OpenAPI.Operation,
): ProcessedResponse[] {
  const responses = (operation as OpenAPIV3.OperationObject).responses;
  if (!responses) return [];

  return Object.entries(responses).map(([statusCode, res]) => {
    const r = res as OpenAPIV3.ResponseObject;
    const [contentType, media] = Object.entries(r.content ?? {})[0] ?? [];
    const schema = media?.schema as OpenAPIV3.SchemaObject | undefined;
    return {
      statusCode,
      description: r.description,
      contentType,
      ...resolveArrayableSchema(
        schema as AnySchemaObject,
        media?.example as object | undefined,
      ),
    };
  });
}
