import { RequestRecord } from '@/types/dbTypes';

interface HistoryListProps {
  records: RequestRecord[];
}
export default async function HistoryList({ records }: HistoryListProps) {
  return (
    <>
      {records.map((record) => {
        return <div key={record.id}>Record {record.id}</div>;
      })}
    </>
  );
}
