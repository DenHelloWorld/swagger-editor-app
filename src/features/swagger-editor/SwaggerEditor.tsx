'use client';

import { useSchemaSync } from './hooks/useSchemaSync';
import { useSchemaRestore } from './hooks/useSchemaRestore';
import { SchemaEditor } from './components/SchemaEditor/SchemaEditor';

export function SwaggerEditor() {
  useSchemaSync();
  useSchemaRestore();
  return <SchemaEditor />;
}
