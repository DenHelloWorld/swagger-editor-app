import { adminAuth } from '@/lib/db/firebase/admin';

export const SESSION_COOKIE_NAME = '__session';
export const SESSION_EXPIRES_IN_MS = 5 * 24 * 60 * 60 * 1000;

export async function createSessionCookie(idToken: string): Promise<string> {
  return adminAuth.createSessionCookie(idToken, {
    expiresIn: SESSION_EXPIRES_IN_MS,
  });
}

export async function verifySessionCookie(
  sessionCookie: string,
): Promise<string | null> {
  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decoded.uid;
  } catch {
    return null;
  }
}

export async function revokeSessionCookie(
  sessionCookie: string,
): Promise<void> {
  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie);
    await adminAuth.revokeRefreshTokens(decoded.uid);
  } catch {
    // Cookie already invalid — nothing to revoke.
  }
}
