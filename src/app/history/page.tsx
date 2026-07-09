import { redirect } from 'next/navigation';
import { getUserIdFromSession } from '@/lib/auth/getUserIdFromSession';
import { getRequestRecords } from '@/lib/db/request-records';
import HistoryList from '@/features/history/components/HistoryList';
import EmptyHistory from '@/features/history/components/EmptyHistory';

export default async function History() {
  const userId = await getUserIdFromSession();

  if (!userId) {
    redirect('/');
  }
  const records = await getRequestRecords(userId);

  if (records.length === 0) {
    return <EmptyHistory />;
  }
  return <HistoryList records={records} />;
}
