import type { OpenAPI, OpenAPIV2, OpenAPIV3 } from 'openapi-types';
import type { ProcessedResponse } from '@/types/openapi';
import { resolveProperties } from './requestBody';

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
    const isArray = schema?.type === 'array';
    const body = (isArray ? schema?.items : schema) as OpenAPIV2.SchemaObject;
    return {
      statusCode,
      description: r.description,
      isArray,
      properties: resolveProperties(
        body?.properties as Record<string, object> | undefined,
        body?.required,
      ),
      example: schema?.example,
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
    const isArray = schema?.type === 'array';
    const body = (isArray ? schema?.items : schema) as OpenAPIV3.SchemaObject;
    return {
      statusCode,
      description: r.description,
      contentType,
      isArray,
      properties: resolveProperties(
        body?.properties as Record<string, object> | undefined,
        body?.required,
      ),
      example: media?.example as object | undefined,
    };
  });
}
