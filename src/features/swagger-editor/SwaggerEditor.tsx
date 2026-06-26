'use client';

import { useSchemaSync } from './hooks/useSchemaSync';
import { SchemaEditor } from './components/SchemaEditor/SchemaEditor';

export function SwaggerEditor() {
  useSchemaSync();
  return <SchemaEditor />;
}
