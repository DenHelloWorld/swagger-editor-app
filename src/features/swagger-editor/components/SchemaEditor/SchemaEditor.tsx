'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import type { OnMount } from '@monaco-editor/react';
import { useSchemaStore } from '@/store/schemaStore';
import { FormatToggle } from '@/features/swagger-editor/components/FormatToggle/FormatToggle';
import { SaveSchemaButton } from '@/features/swagger-editor/components/SchemaEditor/SaveSchemaButton';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { useScrollStore } from '@/store/scrollStore';
import styles from './SchemaEditor.module.css';

type Props = {
  isRestoring?: boolean;
};

function EditorLoadingOverlay() {
  return (
    <div className={styles.editor__loading}>
      <LoadingIndicator />
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
    <div className={styles.editor}>
      <div className={styles.editor__toolbar}>
        <FormatToggle />
        <SaveSchemaButton />
      </div>
      <div className={styles.editor__body}>
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
            wordWrap: 'on',
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
        <div className={styles.editor__errors}>
          {errors.map((error, i) => (
            <p key={i} className={styles.editor__error}>
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
