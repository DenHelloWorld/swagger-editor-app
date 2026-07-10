'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  formatBytes,
  formatTimestamp,
  getMethodVariant,
  getStatusVariant,
} from '@/features/history/utils/recordFormat';
import { RequestRecord } from '@/types/dbTypes';
import { FieldItem } from './FieldItem';
import { ArrowLeft, Eye } from 'lucide-react';
import styles from './HistoryList.module.css';

interface HistoryListProps {
  records: RequestRecord[];
}

export default function HistoryList({ records }: HistoryListProps) {
  const { t } = useTranslation();
  return (
    <section className={styles.list}>
      <header className={styles.list__header}>
        <h1 className={styles.list__title}>{t('history.listTitle')}</h1>
        <p className={styles.list__subtitle}>
          {t('history.recordCount', { count: records.length })}
        </p>
      </header>

      <ul className={styles.list__items}>
        {records.map((record) => (
          <li key={record.id}>
            <Card>
              <CardHeader>
                <CardTitle className={styles.list__record_title}>
                  {record.endpoint}
                </CardTitle>
                <CardDescription>
                  {formatTimestamp(record.timestamp)}
                </CardDescription>
                <CardAction className={styles.list__record_badges}>
                  <Badge variant={getMethodVariant(record.method)}>
                    {record.method}
                  </Badge>
                  <Badge variant={getStatusVariant(record.statusCode)}>
                    {record.statusCode}
                  </Badge>
                </CardAction>
              </CardHeader>

              <CardContent className={styles.list__record_content}>
                <FieldItem
                  label={t('history.fields.url')}
                  value={record.url}
                  mono
                  valueClassName={styles.list__record_url_value}
                />
                <div className={styles.list__record_metrics}>
                  <FieldItem
                    label={t('history.fields.duration')}
                    value={`${record.durationMs} ms`}
                  />
                  <FieldItem
                    label={t('history.fields.request')}
                    value={formatBytes(record.requestSize)}
                  />
                  <FieldItem
                    label={t('history.fields.response')}
                    value={formatBytes(record.responseSize)}
                  />
                </div>
                {record.errorDetails && (
                  <div className={styles.list__record_error}>
                    <FieldItem
                      label={t('history.fields.errorDetails')}
                      value={record.errorDetails}
                      mono
                      valueClassName={styles.list__record_error_value}
                    />
                  </div>
                )}
              </CardContent>

              <CardFooter className={styles.list__record_footer}>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/history/${record.id}`}>
                    <Eye data-icon="inline-start" />
                    {t('history.details')}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
      <Button variant="outline" size="sm" asChild className={styles.list__back}>
        <Link href="/">
          <ArrowLeft data-icon="inline-start" />
          {t('history.backToEditor')}
        </Link>
      </Button>
    </section>
  );
}
