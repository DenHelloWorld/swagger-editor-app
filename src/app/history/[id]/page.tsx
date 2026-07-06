import { redirect } from 'next/navigation';
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
  return (
    <>
      <h1>{record?.timestamp}</h1>
    </>
  );
}
