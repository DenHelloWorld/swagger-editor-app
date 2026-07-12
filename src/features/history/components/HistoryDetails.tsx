import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RequestRecord } from '@/types/dbTypes';
import {
  formatBytes,
  formatTimestamp,
  getMethodVariant,
  getStatusVariant,
} from '@/features/history/utils/recordFormat';
import { type Locale } from '@/i18n/locale';
import { DetailItem } from './DetailItem';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import styles from './HistoryDetails.module.css';

interface HistoryDetailsProps {
  record: RequestRecord;
  locale: Locale;
}

export default async function HistoryDetails({
  record,
  locale,
}: HistoryDetailsProps) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'history' });

  return (
    <section className={styles.details}>
      <header className={styles.details__header}>
        <h1 className={styles.details__title}>{t('detailsTitle')}</h1>
        <p className={styles.details__subtitle}>{t('detailsSubtitle')}</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className={styles.details__record_title}>
            {record.endpoint}
          </CardTitle>
          <CardDescription>{formatTimestamp(record.timestamp)}</CardDescription>
          <CardAction className={styles.details__record_badges}>
            <Badge variant={getMethodVariant(record.method)}>
              {record.method}
            </Badge>
            <Badge variant={getStatusVariant(record.statusCode)}>
              {record.statusCode}
            </Badge>
          </CardAction>
        </CardHeader>

        <CardContent>
          <dl className={styles.details__grid}>
            <DetailItem
              label={t('fields.timestamp')}
              value={formatTimestamp(record.timestamp)}
            />
            <DetailItem label={t('fields.method')} value={record.method} />
            <DetailItem
              label={t('fields.statusCode')}
              value={record.statusCode}
            />
            <DetailItem
              label={t('fields.duration')}
              value={`${record.durationMs} ms`}
            />
            <DetailItem
              label={t('fields.endpoint')}
              value={record.endpoint}
              mono
            />
            <DetailItem label={t('fields.url')} value={record.url} mono />
            <DetailItem
              label={t('fields.requestSize')}
              value={formatBytes(record.requestSize)}
            />
            <DetailItem
              label={t('fields.responseSize')}
              value={formatBytes(record.responseSize)}
            />
            <div className={styles.details__error}>
              <DetailItem
                label={t('fields.errorDetails')}
                value={record.errorDetails ?? '—'}
                mono={Boolean(record.errorDetails)}
              />
            </div>
          </dl>
        </CardContent>
      </Card>
      <Button
        variant="outline"
        size="sm"
        asChild
        className={styles.details__back}
      >
        <Link href="/history">
          <ArrowLeft data-icon="inline-start" />
          {t('backToHistory')}
        </Link>
      </Button>
    </section>
  );
}
