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

interface HistoryDetailsProps {
  record: RequestRecord;
}

export default function HistoryDetails({ record }: HistoryDetailsProps) {
  return (
    <section className="w-full max-w-3xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Request Details
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Analytics for a single API request
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="font-mono text-sm break-all">
            {record.endpoint}
          </CardTitle>
          <CardDescription>{formatTimestamp(record.timestamp)}</CardDescription>
          <CardAction className="flex gap-2">
            <Badge variant={getMethodVariant(record.method)}>
              {record.method}
            </Badge>
            <Badge variant={getStatusVariant(record.statusCode)}>
              {record.statusCode}
            </Badge>
          </CardAction>
        </CardHeader>

        <CardContent>
          <dl className="grid gap-5 sm:grid-cols-2">
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
            <div className="sm:col-span-2">
              <DetailItem
                label="Error Details"
                value={record.errorDetails ?? '—'}
                mono={Boolean(record.errorDetails)}
              />
            </div>
          </dl>
        </CardContent>
      </Card>
    </section>
  );
}
