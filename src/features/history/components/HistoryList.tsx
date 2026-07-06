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
                <div>
                  <p className="text-muted-foreground text-xs tracking-wide uppercase">
                    URL
                  </p>
                  <p className="mt-1 font-mono text-xs break-all">
                    {record.url}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-muted-foreground text-xs tracking-wide uppercase">
                      Duration
                    </p>
                    <p className="mt-1 font-medium">{record.durationMs} ms</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs tracking-wide uppercase">
                      Request
                    </p>
                    <p className="mt-1 font-medium">
                      {formatBytes(record.requestSize)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs tracking-wide uppercase">
                      Response
                    </p>
                    <p className="mt-1 font-medium">
                      {formatBytes(record.responseSize)}
                    </p>
                  </div>
                </div>
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
    </section>
  );
}
