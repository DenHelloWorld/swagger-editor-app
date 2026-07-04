'use client';

import { Button } from '@/components/ui/button';
import { useSchemaSave } from '../../hooks/useSchemaSave';
import { toast } from 'sonner';
import { useEffect } from 'react';

export function SaveSchemaButton() {
  const { isAuthenticated, isValid, status, error, save } = useSchemaSave();

  useEffect(() => {
    if (status === 'success') {
      toast.success('Saved', { position: 'top-center' });
    }
    if (status === 'error' && error) {
      toast.error(error, { position: 'top-center' });
    }
  }, [status, error]);

  if (!isAuthenticated) return null;

  return (
    <Button
      onClick={save}
      disabled={!isValid || status === 'saving'}
      aria-busy={status === 'saving'}
      size="sm"
      variant={status === 'error' ? 'destructive' : 'default'}
    >
      {status === 'saving' ? 'Saving...' : 'Save'}
    </Button>
  );
}
