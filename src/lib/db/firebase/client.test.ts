import { describe, it, expect, vi, beforeEach } from 'vitest';

const initializeApp = vi.fn(() => ({ name: 'app' }));
const getApps = vi.fn(() => []);
const getApp = vi.fn(() => ({ name: 'app' }));
const getAuth = vi.fn(() => ({ kind: 'auth' }));
const getFirestore = vi.fn(() => ({ kind: 'firestore' }));

vi.mock('firebase/app', () => ({
  initializeApp: (...args: unknown[]) => initializeApp(...args),
  getApps: () => getApps(),
  getApp: () => getApp(),
}));
vi.mock('firebase/auth', () => ({
  getAuth: (...args: unknown[]) => getAuth(...args),
}));
vi.mock('firebase/firestore', () => ({
  getFirestore: (...args: unknown[]) => getFirestore(...args),
}));

describe('firebase client', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('throws when firebase is not configured', async () => {
    vi.doMock('./config', () => ({
      isFirebaseConfigured: () => false,
      firebaseConfig: {},
    }));
    const { getFirebaseAuth } = await import('./client');
    expect(() => getFirebaseAuth()).toThrow(/not configured/);
  });

  it('initializes app and returns auth/firestore when configured', async () => {
    vi.doMock('./config', () => ({
      isFirebaseConfigured: () => true,
      firebaseConfig: { apiKey: 'x' },
    }));
    const { getFirebaseAuth, getFirebaseFirestore } = await import('./client');
    const auth = getFirebaseAuth();
    const firestore = getFirebaseFirestore();
    expect(auth).toEqual({ kind: 'auth' });
    expect(firestore).toEqual({ kind: 'firestore' });
    expect(initializeApp).toHaveBeenCalled();

    // second call reuses cached app (getApps returns existing)
    getApps.mockReturnValue([{ name: 'app' }]);
    const auth2 = getFirebaseAuth();
    expect(auth2).toEqual({ kind: 'auth' });

    // second firestore call reuses cached instance
    const firestore2 = getFirebaseFirestore();
    expect(firestore2).toEqual({ kind: 'firestore' });
    expect(getFirestore).toHaveBeenCalledTimes(1);
  });
});
