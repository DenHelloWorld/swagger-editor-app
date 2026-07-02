'use client';

import { Button } from '@/components/ui/button';
import { useSchemaSave } from '../../hooks/useSchemaSave';

export function SaveSchemaButton() {
  const { isAuthenticated, isValid, status, error, save } = useSchemaSave();

  if (!isAuthenticated) return null;

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={save}
        disabled={!isValid || status === 'saving'}
        aria-busy={status === 'saving'}
        size="sm"
        variant={status === 'error' ? 'destructive' : 'default'}
      >
        {status === 'saving' ? 'Saving...' : 'Save'}
      </Button>

      {status === 'success' && (
        <span className="text-sm text-[oklch(var(--success,0.65_0.15_150))]">
          Saved ✓
        </span>
      )}
      {status === 'error' && (
        <span className="text-destructive text-sm">{error}</span>
      )}
    </div>
  );
}
