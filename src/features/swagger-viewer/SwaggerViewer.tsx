'use client';

import { useSchemaStore } from '@/store/schemaStore';
import { EndpointList } from './components/EndpointList/EndpointList';

export function SwaggerViewer() {
  const processedSpec = useSchemaStore((s) => s.processedSpec);

  return <EndpointList spec={processedSpec} />;
}
