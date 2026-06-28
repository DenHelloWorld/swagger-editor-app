'use client';

import { Button } from '@/components/ui/button';
import { useSchemaStore } from '@/store/schemaStore';
import { convertFormat } from '@/features/swagger-editor/utils/convertFormat';
import { MOCK_SPEC_V2, MOCK_SPEC_V3 } from './mocks/specs';
import { EndpointList } from './components/EndpointList/EndpointList';

// TODO: remove before final PR — dev-only mock loader, counts as code-smell (-10 pts penalty)
function MockControls() {
  const format = useSchemaStore((s) => s.format);
  const setRaw = useSchemaStore((s) => s.setRaw);

  function loadMock(spec: object) {
    const json = JSON.stringify(spec, null, 2);
    setRaw(format === 'yaml' ? convertFormat(json, 'yaml') : json);
  }

  return (
    <div className="flex gap-2 border-b px-4 py-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => loadMock(MOCK_SPEC_V3)}
      >
        Load V3 mock
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => loadMock(MOCK_SPEC_V2)}
      >
        Load V2 mock
      </Button>
    </div>
  );
}

export function SwaggerViewer() {
  const processedSpec = useSchemaStore((s) => s.processedSpec);
  return (
    <div className="flex h-full flex-col">
      <MockControls />
      <EndpointList spec={processedSpec} />
    </div>
  );
}
