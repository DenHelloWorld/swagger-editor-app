import { redirect } from 'next/navigation';
import { getUserIdFromSession } from '@/lib/auth/getUserIdFromSession';

export default async function History() {
  const userId = await getUserIdFromSession();

  if (!userId) {
    redirect('/');
  }

  return <div>History page</div>;
}
