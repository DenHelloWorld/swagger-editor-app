'use client';

import { useSchemaStore } from '@/store/schemaStore';
import { convertFormat } from '../../utils/convertFormat';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftRight, Braces, FileCode } from 'lucide-react';
import styles from './FormatToggle.module.css';

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
    <div className={styles.toggle}>
      <Button onClick={handleToggle} variant="outline" size="sm">
        <ArrowLeftRight data-icon="inline-start" />
        {format === 'json' ? 'YAML' : 'JSON'}
      </Button>
      <Badge variant="secondary">
        {format === 'json' ? (
          <Braces data-icon="inline-start" />
        ) : (
          <FileCode data-icon="inline-start" />
        )}
        {format.toUpperCase()}
      </Badge>
    </div>
  );
}
