'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import styles from './EmptyHistory.module.css';

export default function EmptyHistory() {
  const { t } = useTranslation();
  return (
    <Card className={styles.empty}>
      <CardContent className={styles.empty__content}>
        <div className={styles.empty__text}>
          <p className={styles.empty__title}>{t('history.emptyTitle')}</p>
          <p className={styles.empty__hint}>{t('history.emptyHint')}</p>
        </div>

        <Button
          variant="outline"
          size="sm"
          asChild
          className={styles.empty__cta}
        >
          <Link href="/">
            {t('history.goToEditor')}
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
