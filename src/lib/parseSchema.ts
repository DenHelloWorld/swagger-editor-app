import * as yaml from 'js-yaml';
import type { OpenAPIDocument } from '@/types/openapi';

type ParseResult =
  | { success: true; doc: OpenAPIDocument; format: 'json' | 'yaml' }
  | { success: false; error: string };

export function detectFormat(raw: string): 'json' | 'yaml' {
  const trimmed = raw.trimStart();
  return trimmed.startsWith('{') || trimmed.startsWith('[') ? 'json' : 'yaml';
}

export function parseSchema(raw: string): ParseResult {
  if (!raw.trim()) {
    return { success: false, error: 'Schema is empty' };
  }

  const format = detectFormat(raw);

  try {
    const doc = format === 'json' ? JSON.parse(raw) : yaml.load(raw);

    return { success: true, doc: doc as OpenAPIDocument, format };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to parse schema';
    return { success: false, error: message };
  }
}
