import { describe, it, expect, vi, beforeEach } from 'vitest';

const initializeApp = vi.fn(() => ({ name: 'admin-app' }));
const getApps = vi.fn(() => []);
const cert = vi.fn((c: unknown) => c);
const getAuth = vi.fn(() => ({ kind: 'admin-auth' }));
const getFirestore = vi.fn(() => ({ kind: 'admin-firestore' }));

vi.mock('firebase-admin/app', () => ({
  initializeApp: (...args: unknown[]) => initializeApp(...args),
  getApps: () => getApps(),
  cert: (...args: unknown[]) => cert(...args),
}));
vi.mock('firebase-admin/auth', () => ({
  getAuth: (...args: unknown[]) => getAuth(...args),
}));
vi.mock('firebase-admin/firestore', () => ({
  getFirestore: (...args: unknown[]) => getFirestore(...args),
}));

describe('firebase admin', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env = { ...OLD_ENV };
  });

  it('throws when admin credentials are missing', async () => {
    delete process.env.FIREBASE_PROJECT_ID;
    delete process.env.FIREBASE_CLIENT_EMAIL;
    delete process.env.FIREBASE_PRIVATE_KEY;
    const { getFirebaseAdminAuth } = await import('./admin');
    expect(() => getFirebaseAdminAuth()).toThrow(/not configured/);
  });

  it('initializes app and returns auth/firestore when configured', async () => {
    process.env.FIREBASE_PROJECT_ID = 'proj';
    process.env.FIREBASE_CLIENT_EMAIL = 'email@example.com';
    process.env.FIREBASE_PRIVATE_KEY = 'key\\nline';
    const { getFirebaseAdminAuth, getFirebaseAdminFirestore } =
      await import('./admin');
    const auth = getFirebaseAdminAuth();
    const firestore = getFirebaseAdminFirestore();
    expect(auth).toEqual({ kind: 'admin-auth' });
    expect(firestore).toEqual({ kind: 'admin-firestore' });
    expect(initializeApp).toHaveBeenCalled();

    getApps.mockReturnValue([{ name: 'admin-app' }]);
    const auth2 = getFirebaseAdminAuth();
    expect(auth2).toEqual({ kind: 'admin-auth' });
  });
});
