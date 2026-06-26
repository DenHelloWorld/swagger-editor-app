import { create } from 'zustand';
import type { OpenAPIDocument } from '@/types/openapi';

type Format = 'json' | 'yaml';

type SchemaStore = {
  spec: OpenAPIDocument | null;
  raw: string;
  format: Format;
  errors: string[];

  setRaw: (raw: string) => void;
  setFormat: (format: Format) => void;
  setSpec: (spec: OpenAPIDocument | null) => void;
  setErrors: (errors: string[]) => void;
};

export const useSchemaStore = create<SchemaStore>((set) => ({
  spec: null,
  raw: '',
  format: 'json',
  errors: [],

  setRaw: (raw) => set({ raw }),
  setFormat: (format) => set({ format }),
  setSpec: (spec) => set({ spec }),
  setErrors: (errors) => set({ errors }),
}));
