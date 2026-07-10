'use client';

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-xl font-semibold">{t('errorPage.title')}</h2>
      <p className="text-muted-foreground max-w-md text-sm">
        {t('errorPage.message')}
      </p>
      <div className="flex gap-3">
        <Button onClick={reset} variant="default">
          {t('errorPage.retry')}
        </Button>
      </div>
    </div>
  );
}
