'use client';

import { useSchemaStore } from '@/store/schemaStore';
import { convertFormat } from '../../utils/convertFormat';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight } from 'lucide-react';

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
    <Button onClick={handleToggle} variant="outline" size="sm">
      <ArrowLeftRight data-icon="inline-start" />
      {format === 'json' ? 'YAML' : 'JSON'}
    </Button>
  );
}
