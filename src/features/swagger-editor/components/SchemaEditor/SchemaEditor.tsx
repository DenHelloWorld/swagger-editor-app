'use client';

import dynamic from 'next/dynamic';
import { useSchemaStore } from '@/store/schemaStore';

const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.default),
  { ssr: false, loading: () => <div>Loading editor...</div> },
);

export function SchemaEditor() {
  const { raw, format, errors, setRaw } = useSchemaStore();

  function handleChange(value: string | undefined) {
    setRaw(value ?? '');
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1">
        <MonacoEditor
          height="100%"
          language={format}
          value={raw}
          onChange={handleChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
          }}
        />
      </div>
      {errors.length > 0 && (
        <div className="border-t bg-red-50 px-4 py-2">
          {errors.map((error, i) => (
            <p key={i} className="text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
