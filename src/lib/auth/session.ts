import { getFirebaseAdminAuth } from '@/lib/db/firebase/admin';
import { SESSION_COOKIE_NAME, SESSION_EXPIRES_IN_MS } from './sessionCookie';

export { SESSION_COOKIE_NAME, SESSION_EXPIRES_IN_MS };

export async function createSessionCookie(idToken: string): Promise<string> {
  return getFirebaseAdminAuth().createSessionCookie(idToken, {
    expiresIn: SESSION_EXPIRES_IN_MS,
  });
}

export async function verifySessionCookie(
  sessionCookie: string,
): Promise<string | null> {
  try {
    const decoded = await getFirebaseAdminAuth().verifySessionCookie(
      sessionCookie,
      true,
    );
    return decoded.uid;
  } catch {
    return null;
  }
}

export async function revokeSessionCookie(
  sessionCookie: string,
): Promise<void> {
  try {
    const adminAuth = getFirebaseAdminAuth();
    const decoded = await adminAuth.verifySessionCookie(sessionCookie);
    await adminAuth.revokeRefreshTokens(decoded.uid);
  } catch {
    // Cookie already invalid — nothing to revoke.
  }
}
