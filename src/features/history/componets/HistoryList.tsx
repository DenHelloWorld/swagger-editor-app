import { Button } from '@/components/ui/button';
import { RequestRecord } from '@/types/dbTypes';
import Link from 'next/link';

interface HistoryListProps {
  records: RequestRecord[];
}
export default async function HistoryList({ records }: HistoryListProps) {
  return (
    <>
      {records.map((record, index) => {
        return (
          <div key={record.id}>
            {' '}
            record # {index + 1}{' '}
            <Button variant="outline" size="sm" asChild>
              <Link href={`/history/${record.id}`}>Details</Link>
            </Button>
          </div>
        );
      })}
    </>
  );
}
