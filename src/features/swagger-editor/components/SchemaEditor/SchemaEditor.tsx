'use client';

import dynamic from 'next/dynamic';
import { useSchemaStore } from '@/store/schemaStore';
import { FormatToggle } from '@/features/swagger-editor/components/FormatToggle/FormatToggle';
import { SaveSchemaButton } from '@/features/swagger-editor/components/SchemaEditor/SaveSchemaButton';
import { Spinner } from '@/components/ui/spinner';

type Props = {
  isRestoring?: boolean;
};

const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.default),
  { ssr: false, loading: () => <div>Loading editor...</div> },
);

export function SchemaEditor({ isRestoring = false }: Props) {
  const { raw, format, errors, setRaw } = useSchemaStore();

  function handleChange(value: string | undefined) {
    setRaw(value ?? '');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="flex items-center justify-between border-b px-4 py-2">
        <FormatToggle />
        <SaveSchemaButton />
      </div>
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        {isRestoring && (
          <div className="bg-background/80 absolute inset-0 z-10 flex flex-col items-center justify-center gap-2">
            <Spinner className="size-5" />
            <span className="text-muted-foreground text-sm">
              Loading your schema...
            </span>
          </div>
        )}
        <MonacoEditor
          height="100%"
          width="100%"
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
