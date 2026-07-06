import { redirect } from 'next/navigation';
import { getUserIdFromSession } from '@/lib/auth/getUserIdFromSession';
import { getRequestRecords } from '@/lib/db/request-records';
import HistoryList from '@/features/history/componets/HistoryList';

export default async function History() {
  const userId = await getUserIdFromSession();

  if (!userId) {
    redirect('/');
  }
  const records = await getRequestRecords(userId);
  return <HistoryList records={records} />;
}
