'use client';

import { Button } from '@/components/ui/button';
import { useSchemaSave } from '../../hooks/useSchemaSave';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { Save } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

export function SaveSchemaButton() {
  const { isAuthenticated, isValid, status, error, save } = useSchemaSave();

  useEffect(() => {
    if (status === 'success') {
      toast.success('Saved');
    } else if (status === 'error' && error) {
      toast.error(error);
    }
  }, [status, error]);

  if (!isAuthenticated) return null;

  return (
    <Button
      onClick={save}
      disabled={!isValid || status === 'saving'}
      aria-busy={status === 'saving'}
      size="sm"
      variant="default"
    >
      {status === 'saving' ? (
        <>
          <Spinner data-icon="inline-start" />
          Saving...
        </>
      ) : (
        <>
          <Save data-icon="inline-start" />
          Save
        </>
      )}
    </Button>
  );
}
