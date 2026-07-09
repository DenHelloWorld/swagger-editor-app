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
  return (
    <section className={styles.details}>
      <header className={styles.details__header}>
        <h1 className={styles.details__title}>Request Details</h1>
        <p className={styles.details__subtitle}>
          Analytics for a single API request
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
              label="Timestamp"
              value={formatTimestamp(record.timestamp)}
            />
            <DetailItem label="Method" value={record.method} />
            <DetailItem label="Status Code" value={record.statusCode} />
            <DetailItem label="Duration" value={`${record.durationMs} ms`} />
            <DetailItem label="Endpoint" value={record.endpoint} mono />
            <DetailItem label="URL" value={record.url} mono />
            <DetailItem
              label="Request Size"
              value={formatBytes(record.requestSize)}
            />
            <DetailItem
              label="Response Size"
              value={formatBytes(record.responseSize)}
            />
            <div className={styles.details__error}>
              <DetailItem
                label="Error Details"
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
          Back to History
        </Link>
      </Button>
    </section>
  );
}
