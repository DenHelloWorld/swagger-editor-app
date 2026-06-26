'use client';

import { useSchemaStore } from '@/store/schemaStore';
import { convertFormat } from '../../utils/convertFormat';

export function FormatToggle() {
  const { raw, format, setRaw, setFormat } = useSchemaStore();

  function handleToggle() {
    const targetFormat = format === 'json' ? 'yaml' : 'json';

    try {
      const converted = convertFormat(raw, targetFormat);
      setRaw(converted);
      setFormat(targetFormat);
    } catch {
      setFormat(targetFormat);
    }
  }

  return (
    <button
      onClick={handleToggle}
      className="cursor-pointer rounded border px-3 py-1 font-mono text-sm"
    >
      {format === 'json' ? 'YAML' : 'JSON'}
    </button>
  );
}
