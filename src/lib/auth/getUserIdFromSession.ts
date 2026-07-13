import { cookies } from 'next/headers';
import { SESSION_COOKIE_NAME, verifySessionCookie } from './session';

export async function getUserIdFromSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return null;
  }

  return verifySessionCookie(sessionCookie);
}
