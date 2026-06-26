'use client';
import { useSchemaStore } from '@/store/schemaStore';

export function useSchema() {
  return { spec: useSchemaStore((s) => s.spec) };
}
