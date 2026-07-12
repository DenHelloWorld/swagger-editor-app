import { redirect } from 'next/navigation';
import { getUserIdFromSession } from '@/lib/auth/getUserIdFromSession';
import { getRequestRecords } from '@/lib/db/request-records';
import HistoryList from '@/features/history/components/HistoryList';
import EmptyHistory from '@/features/history/components/EmptyHistory';
import { getServerLocale } from '@/i18n/server-locale';

export default async function HistoryPage() {
  const locale = await getServerLocale();
  const userId = await getUserIdFromSession();

  if (!userId) {
    redirect('/');
  }

  const records = await getRequestRecords(userId);

  if (records.length === 0) {
    return <EmptyHistory locale={locale} />;
  }

  return <HistoryList records={records} locale={locale} />;
}
