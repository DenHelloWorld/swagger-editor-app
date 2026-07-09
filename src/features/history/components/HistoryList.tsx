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

interface HistoryListProps {
  records: RequestRecord[];
}

export default function HistoryList({ records }: HistoryListProps) {
  return (
    <section className="w-full max-w-3xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Request History
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {records.length} request{records.length === 1 ? '' : 's'} recorded
        </p>
      </header>

      <ul className="flex flex-col gap-4">
        {records.map((record) => (
          <li key={record.id}>
            <Card>
              <CardHeader>
                <CardTitle className="font-mono text-sm break-all">
                  {record.endpoint}
                </CardTitle>
                <CardDescription>
                  {formatTimestamp(record.timestamp)}
                </CardDescription>
                <CardAction className="flex gap-2">
                  <Badge variant={getMethodVariant(record.method)}>
                    {record.method}
                  </Badge>
                  <Badge variant={getStatusVariant(record.statusCode)}>
                    {record.statusCode}
                  </Badge>
                </CardAction>
              </CardHeader>

              <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
                <FieldItem
                  label="URL"
                  value={record.url}
                  mono
                  valueClassName="text-xs"
                />
                <div className="grid grid-cols-3 gap-3">
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
                  <div className="sm:col-span-2">
                    <FieldItem
                      label="Error Details"
                      value={record.errorDetails}
                      mono
                      valueClassName="text-destructive text-xs"
                    />
                  </div>
                )}
              </CardContent>

              <CardFooter className="justify-end">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/history/${record.id}`}>Details</Link>
                </Button>
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
      <Button variant="outline" size="sm" asChild className="mt-2">
        <Link href="/">Back to Editor &amp; Viewer</Link>
      </Button>
    </section>
  );
}
