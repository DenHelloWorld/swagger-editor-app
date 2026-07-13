import { create } from 'zustand';
import type { ProcessedSpec } from '@/types/openapi';

type Format = 'json' | 'yaml';

type SchemaStore = {
  processedSpec: ProcessedSpec | null;
  raw: string;
  format: Format;
  errors: string[];

  setRaw: (raw: string) => void;
  setFormat: (format: Format) => void;
  setSpec: (processedSpec: ProcessedSpec | null) => void;
  setErrors: (errors: string[]) => void;
  reset: () => void;
};

export const useSchemaStore = create<SchemaStore>((set) => ({
  processedSpec: null,
  raw: '',
  format: 'json',
  errors: [],

  setRaw: (raw) => set({ raw }),
  setFormat: (format) => set({ format }),
  setSpec: (processedSpec) => set({ processedSpec }),
  setErrors: (errors) => set({ errors }),
  reset: () =>
    set({ processedSpec: null, raw: '', format: 'json', errors: [] }),
}));
