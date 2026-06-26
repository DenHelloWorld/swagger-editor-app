'use client';

import dynamic from 'next/dynamic';
import { useSchemaStore } from '@/store/schemaStore';
import { FormatToggle } from '../../FormatToggle/FormatToggle';

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
    <>
      <div className="border-b px-4 py-2">
        <FormatToggle />
      </div>
      <MonacoEditor
        height="600px"
        language={format}
        value={raw}
        onChange={handleChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
      {errors.length > 0 && (
        <div className="border-t bg-red-50 px-4 py-2">
          {errors.map((error, i) => (
            <p key={i} className="text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>
      )}
    </>
  );
}
