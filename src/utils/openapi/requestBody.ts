import type { OpenAPI, OpenAPIV2, OpenAPIV3 } from 'openapi-types';
import type {
  AnySchemaObject,
  ProcessedRequestBody,
  ProcessedSchemaProperty,
} from '@/types/openapi';

/**
 * Flattens a raw `properties` map into a normalized array.
 * Marks each property as required based on the parent schema's `required` array.
 */
export function resolveProperties(
  properties: Record<string, object> | undefined,
  required: string[] = [],
): ProcessedSchemaProperty[] {
  if (!properties) return [];
  return Object.entries(properties).map(([name, prop]) => {
    const p = prop as OpenAPIV2.SchemaObject & OpenAPIV3.SchemaObject;
    return {
      name,
      type: p.type as string | undefined,
      enum: p.enum as string[] | undefined,
      description: p.description,
      required: required.includes(name),
    };
  });
}

/**
 * Resolves a schema that may wrap an array — if `schema.type === 'array'`, unwraps `items`.
 * Returns normalized `isArray`, `properties`, and `example`.
 */
export function resolveArrayableSchema(
  schema: AnySchemaObject | undefined,
  example?: object,
): {
  isArray: boolean;
  properties: ProcessedSchemaProperty[];
  example?: object;
} {
  const isArray = schema?.type === 'array';
  const body = (isArray ? schema?.items : schema) as
    | AnySchemaObject
    | undefined;
  return {
    isArray,
    properties: resolveProperties(
      body?.properties as Record<string, object> | undefined,
      body?.required,
    ),
    example,
  };
}

/**
 * Extracts and normalizes the request body from a Swagger 2.0 operation (`in: body` parameter).
 * Returns `null` if no body parameter exists or if the schema is absent.
 */
export function getV2RequestBody(
  operation: OpenAPI.Operation,
): ProcessedRequestBody | null {
  const params = operation.parameters as
    | (OpenAPIV2.InBodyParameterObject | OpenAPIV2.GeneralParameterObject)[]
    | undefined;
  const rb = params?.find(
    (p): p is OpenAPIV2.InBodyParameterObject => p.in === 'body',
  );
  if (!rb?.schema) return null;
  const schema = rb.schema as AnySchemaObject & { example?: object };
  return resolveArrayableSchema(schema, schema.example);
}

/**
 * Extracts and normalizes the request body from an OpenAPI 3.x operation.
 * Takes the first `content` entry. Returns `null` if `requestBody` is absent or has no content entries.
 */
export function getV3RequestBody(
  operation: OpenAPI.Operation,
): ProcessedRequestBody | null {
  const rb = (operation as { requestBody?: OpenAPIV3.RequestBodyObject })
    .requestBody;
  if (!rb) return null;
  const [contentType, media] = Object.entries(rb.content ?? {})[0] ?? [];
  if (!contentType || !media) return null;
  const schema = media.schema as AnySchemaObject | undefined;
  return {
    contentType,
    required: rb.required,
    ...resolveArrayableSchema(schema, media.example as object | undefined),
  };
}
