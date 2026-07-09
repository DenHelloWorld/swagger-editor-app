import Link from 'next/link';
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
  return (
    <section className={styles.list}>
      <header className={styles.list__header}>
        <h1 className={styles.list__title}>Request History</h1>
        <p className={styles.list__subtitle}>
          {records.length} request{records.length === 1 ? '' : 's'} recorded
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
                  label="URL"
                  value={record.url}
                  mono
                  valueClassName={styles.list__record_url_value}
                />
                <div className={styles.list__record_metrics}>
                  <FieldItem
                    label="Duration"
                    value={`${record.durationMs} ms`}
                  />
                  <FieldItem
                    label="Request"
                    value={formatBytes(record.requestSize)}
                  />
                  <FieldItem
                    label="Response"
                    value={formatBytes(record.responseSize)}
                  />
                </div>
                {record.errorDetails && (
                  <div className={styles.list__record_error}>
                    <FieldItem
                      label="Error Details"
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
                    Details
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
          Back to Editor &amp; Viewer
        </Link>
      </Button>
    </section>
  );
}
