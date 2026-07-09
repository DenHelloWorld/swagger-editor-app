'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import type { OnMount } from '@monaco-editor/react';
import { useSchemaStore } from '@/store/schemaStore';
import { FormatToggle } from '@/features/swagger-editor/components/FormatToggle/FormatToggle';
import { SaveSchemaButton } from '@/features/swagger-editor/components/SchemaEditor/SaveSchemaButton';
import { Spinner } from '@/components/ui/spinner';
import { useScrollStore } from '@/store/scrollStore';

type Props = {
  isRestoring?: boolean;
};

function EditorLoadingOverlay() {
  return (
    <div className="bg-background absolute inset-0 z-10 flex flex-col items-center justify-center gap-2">
      <Spinner className="size-5" />
      <span className="text-muted-foreground text-sm">Loading...</span>
    </div>
  );
}

const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.default),
  { ssr: false, loading: EditorLoadingOverlay },
);

export function SchemaEditor({ isRestoring = false }: Props) {
  const { raw, format, errors, setRaw } = useSchemaStore();
  const [isEditorMounted, setIsEditorMounted] = useState(false);
  const setScrolled = useScrollStore((s) => s.setScrolled);

  const isLoading = isRestoring || !isEditorMounted;

  function handleChange(value: string | undefined) {
    setRaw(value ?? '');
  }

  const handleEditorMount: OnMount = (editor) => {
    setIsEditorMounted(true);
    editor.onDidScrollChange((e) => setScrolled(e.scrollTop > 0));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="flex items-center justify-between border-b px-4 py-2">
        <FormatToggle />
        <SaveSchemaButton />
      </div>
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        {isLoading && <EditorLoadingOverlay />}
        <MonacoEditor
          height="100%"
          width="100%"
          language={format}
          value={raw}
          onChange={handleChange}
          onMount={handleEditorMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            scrollbar: {
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
              useShadows: false,
              verticalHasArrows: false,
              horizontalHasArrows: false,
            },
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
