import { notFound, redirect } from 'next/navigation';
import HistoryDetails from '@/features/history/components/HistoryDetails';
import { getUserIdFromSession } from '@/lib/auth/getUserIdFromSession';
import { getRequestRecordById } from '@/lib/db/request-records';

interface DetailsProps {
  params: Promise<{ id: string }>;
}

export default async function Details({ params }: DetailsProps) {
  const userId = await getUserIdFromSession();
  const { id } = await params;

  if (!userId) {
    redirect('/');
  }

  const record = await getRequestRecordById(userId, id);

  if (!record) {
    notFound();
  }

  return <HistoryDetails record={record} />;
}
