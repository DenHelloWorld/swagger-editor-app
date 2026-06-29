import SwaggerParser from '@apidevtools/swagger-parser';
import type { OpenAPI } from 'openapi-types';

type ValidationResult =
  | { valid: true; doc: OpenAPI.Document }
  | { valid: false; errors: string[] };

/**
 * Validates an OpenAPI document against the OpenAPI specification using swagger-parser.
 * @returns `{ valid: true, doc }` with the dereferenced document on success, `{ valid: false, errors }` on failure.
 */
export async function validateSchema(
  doc: OpenAPI.Document,
): Promise<ValidationResult> {
  try {
    const resolved = (await SwaggerParser.validate(
      doc as unknown as Parameters<typeof SwaggerParser.validate>[0],
    )) as OpenAPI.Document;
    return { valid: true, doc: resolved };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Invalid schema';
    return { valid: false, errors: [message] };
  }
}
