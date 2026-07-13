'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-muted-foreground text-lg">
        {t('notFound.message', 'This page doesn’t exist')}
      </p>
      <Button asChild>
        <Link href="/">{t('notFound.backHome', 'Back to Main page')}</Link>
      </Button>
    </div>
  );
}
