import * as yaml from 'js-yaml';
import type { OpenAPI } from 'openapi-types';

type ParseResult =
  | { success: true; doc: OpenAPI.Document; format: 'json' | 'yaml' }
  | { success: false; error: string };

/** Detects whether a raw schema string is JSON or YAML based on its first non-whitespace character. */
export function detectFormat(raw: string): 'json' | 'yaml' {
  const trimmed = raw.trimStart();
  return trimmed.startsWith('{') || trimmed.startsWith('[') ? 'json' : 'yaml';
}

/**
 * Parses a raw JSON or YAML string into an OpenAPI document.
 * @returns `{ success: true, doc, format }` on success, `{ success: false, error }` on failure.
 */
export function parseSchema(raw: string): ParseResult {
  if (!raw.trim()) return { success: false, error: 'Schema is empty' };
  const format = detectFormat(raw);
  try {
    const doc = format === 'json' ? JSON.parse(raw) : yaml.load(raw);
    return { success: true, doc: doc as OpenAPI.Document, format };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to parse schema';
    return { success: false, error: message };
  }
}
