import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { type Locale } from '@/i18n/locale';
import { ArrowRight } from 'lucide-react';
import styles from './EmptyHistory.module.css';

interface EmptyHistoryProps {
  locale: Locale;
}

export default async function EmptyHistory({ locale }: EmptyHistoryProps) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'history' });

  return (
    <Card className={styles.empty}>
      <CardContent className={styles.empty__content}>
        <div className={styles.empty__text}>
          <p className={styles.empty__title}>{t('emptyTitle')}</p>
          <p className={styles.empty__hint}>{t('emptyHint')}</p>
        </div>

        <Button
          variant="outline"
          size="sm"
          asChild
          className={styles.empty__cta}
        >
          <Link href="/">
            {t('goToEditor')}
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
