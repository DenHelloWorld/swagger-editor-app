import { notFound, redirect } from 'next/navigation';
import HistoryDetails from '@/features/history/components/HistoryDetails';
import { getUserIdFromSession } from '@/lib/auth/getUserIdFromSession';
import { getRequestRecordById } from '@/lib/db/request-records';
import { getServerLocale } from '@/i18n/server-locale';

interface HistoryDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function HistoryDetailsPage({
  params,
}: HistoryDetailsPageProps) {
  const locale = await getServerLocale();
  const userId = await getUserIdFromSession();
  const { id } = await params;

  if (!userId) {
    redirect('/');
  }

  const record = await getRequestRecordById(userId, id);

  if (!record) {
    notFound();
  }

  return <HistoryDetails record={record} locale={locale} />;
}
