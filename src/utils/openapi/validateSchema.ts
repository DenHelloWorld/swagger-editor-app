import SwaggerParser from '@apidevtools/swagger-parser';
import type { OpenAPIDocument } from '@/types/openapi';

type ValidationResult = { valid: true } | { valid: false; errors: string[] };

/**
 * Validates an OpenAPI document against the OpenAPI specification using swagger-parser.
 * @returns `{ valid: true }` on success, `{ valid: false, errors }` on failure.
 */
export async function validateSchema(
  doc: OpenAPIDocument,
): Promise<ValidationResult> {
  try {
    await SwaggerParser.validate(
      doc as unknown as Parameters<typeof SwaggerParser.validate>[0],
    );
    return { valid: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Invalid schema';
    return { valid: false, errors: [message] };
  }
}
