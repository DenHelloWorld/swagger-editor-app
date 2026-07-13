'use client';

import { Button } from '@/components/ui/button';
import { useSchemaSave } from '../../hooks/useSchemaSave';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { Save } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { useTranslation } from 'react-i18next';

export function SaveSchemaButton() {
  const { t } = useTranslation();
  const { isAuthenticated, isValid, status, error, save } = useSchemaSave();

  useEffect(() => {
    if (status === 'success') {
      toast.success(t('editor.saved'));
    } else if (status === 'error' && error) {
      toast.error(error);
    }
  }, [status, error, t]);

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
          {t('editor.saving')}
        </>
      ) : (
        <>
          <Save data-icon="inline-start" />
          {t('editor.save')}
        </>
      )}
    </Button>
  );
}
