'use client';

import { useTranslation } from 'react-i18next';
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
import { DetailItem } from './DetailItem';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import styles from './HistoryDetails.module.css';

interface HistoryDetailsProps {
  record: RequestRecord;
}

export default function HistoryDetails({ record }: HistoryDetailsProps) {
  const { t } = useTranslation();
  return (
    <section className={styles.details}>
      <header className={styles.details__header}>
        <h1 className={styles.details__title}>{t('history.detailsTitle')}</h1>
        <p className={styles.details__subtitle}>
          {t('history.detailsSubtitle')}
        </p>
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
              label={t('history.fields.timestamp')}
              value={formatTimestamp(record.timestamp)}
            />
            <DetailItem
              label={t('history.fields.method')}
              value={record.method}
            />
            <DetailItem
              label={t('history.fields.statusCode')}
              value={record.statusCode}
            />
            <DetailItem
              label={t('history.fields.duration')}
              value={`${record.durationMs} ms`}
            />
            <DetailItem
              label={t('history.fields.endpoint')}
              value={record.endpoint}
              mono
            />
            <DetailItem
              label={t('history.fields.url')}
              value={record.url}
              mono
            />
            <DetailItem
              label={t('history.fields.requestSize')}
              value={formatBytes(record.requestSize)}
            />
            <DetailItem
              label={t('history.fields.responseSize')}
              value={formatBytes(record.responseSize)}
            />
            <div className={styles.details__error}>
              <DetailItem
                label={t('history.fields.errorDetails')}
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
          {t('history.backToHistory')}
        </Link>
      </Button>
    </section>
  );
}
