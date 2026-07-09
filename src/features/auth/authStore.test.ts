// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';

const getFirebaseAuth = vi.fn();
vi.mock('@/lib/db/firebase/client', () => ({
  getFirebaseAuth: (...args: unknown[]) => getFirebaseAuth(...args),
}));

const createUserWithEmailAndPassword = vi.fn();
const signInWithEmailAndPassword = vi.fn();
const onAuthStateChanged = vi.fn();
const firebaseSignOut = vi.fn();

vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: (...args: unknown[]) =>
    createUserWithEmailAndPassword(...args),
  signInWithEmailAndPassword: (...args: unknown[]) =>
    signInWithEmailAndPassword(...args),
  onAuthStateChanged: (...args: unknown[]) => onAuthStateChanged(...args),
  signOut: (...args: unknown[]) => firebaseSignOut(...args),
}));

const syncSession = vi.fn();
const clearSession = vi.fn();
vi.mock('@/features/auth/authService', () => ({
  syncSession: (...args: unknown[]) => syncSession(...args),
  clearSession: (...args: unknown[]) => clearSession(...args),
}));

import { useAuthStore } from './authStore';

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ user: null, isLoading: true, sessionError: null });
  });

  it('signIn returns null on success', async () => {
    getFirebaseAuth.mockReturnValue({ kind: 'auth' });
    signInWithEmailAndPassword.mockResolvedValue({});
    const result = await useAuthStore.getState().signIn('a@b.com', 'pw');
    expect(result).toBeNull();
  });

  it('signIn returns error message on failure', async () => {
    getFirebaseAuth.mockReturnValue({ kind: 'auth' });
    signInWithEmailAndPassword.mockRejectedValue(new Error('fail'));
    const result = await useAuthStore.getState().signIn('a@b.com', 'pw');
    expect(result).toBe('Something went wrong. Please try again.');
  });

  it('signUp returns null on success', async () => {
    getFirebaseAuth.mockReturnValue({ kind: 'auth' });
    createUserWithEmailAndPassword.mockResolvedValue({});
    const result = await useAuthStore.getState().signUp('a@b.com', 'pw');
    expect(result).toBeNull();
  });

  it('signUp returns error message on failure', async () => {
    getFirebaseAuth.mockReturnValue({ kind: 'auth' });
    createUserWithEmailAndPassword.mockRejectedValue(new Error('fail'));
    const result = await useAuthStore.getState().signUp('a@b.com', 'pw');
    expect(result).toBe('Something went wrong. Please try again.');
  });

  it('signOut clears session and signs out', async () => {
    getFirebaseAuth.mockReturnValue({ kind: 'auth' });
    clearSession.mockResolvedValue(undefined);
    firebaseSignOut.mockResolvedValue(undefined);
    const result = await useAuthStore.getState().signOut();
    expect(result).toBeNull();
    expect(clearSession).toHaveBeenCalled();
  });

  it('signOut returns error message and resets state on failure', async () => {
    getFirebaseAuth.mockReturnValue({ kind: 'auth' });
    clearSession.mockRejectedValue(new Error('fail'));
    const result = await useAuthStore.getState().signOut();
    expect(result).toBe('Something went wrong. Please try again.');
    expect(useAuthStore.getState().isLoading).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('clearSessionError resets sessionError', () => {
    useAuthStore.setState({ sessionError: 'oops' });
    useAuthStore.getState().clearSessionError();
    expect(useAuthStore.getState().sessionError).toBeNull();
  });

  it('initAuth sets state to no user when getFirebaseAuth throws', () => {
    getFirebaseAuth.mockImplementation(() => {
      throw new Error('not configured');
    });
    const unsubscribe = useAuthStore.getState().initAuth();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isLoading).toBe(false);
    expect(typeof unsubscribe).toBe('function');
  });

  it('initAuth sets state to no user when firebase reports signed out', () => {
    getFirebaseAuth.mockReturnValue({ kind: 'auth' });
    let capturedCallback: (user: unknown) => void = () => {};
    onAuthStateChanged.mockImplementation((_auth, cb) => {
      capturedCallback = cb;
      return () => {};
    });
    useAuthStore.getState().initAuth();
    capturedCallback(null);
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  it('initAuth signs user in when session sync succeeds', async () => {
    getFirebaseAuth.mockReturnValue({ kind: 'auth' });
    syncSession.mockResolvedValue(null);
    let capturedCallback: (user: unknown) => Promise<void> = async () => {};
    onAuthStateChanged.mockImplementation((_auth, cb) => {
      capturedCallback = cb;
      return () => {};
    });
    useAuthStore.getState().initAuth();
    await capturedCallback({
      uid: 'u1',
      email: 'a@b.com',
      getIdToken: () => Promise.resolve('tok'),
    });
    expect(useAuthStore.getState().user).toEqual({
      uid: 'u1',
      email: 'a@b.com',
    });
    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  it('initAuth signs out and sets sessionError when sync fails', async () => {
    getFirebaseAuth.mockReturnValue({ kind: 'auth' });
    syncSession.mockResolvedValue('session error');
    firebaseSignOut.mockResolvedValue(undefined);
    let capturedCallback: (user: unknown) => Promise<void> = async () => {};
    onAuthStateChanged.mockImplementation((_auth, cb) => {
      capturedCallback = cb;
      return () => {};
    });
    useAuthStore.getState().initAuth();
    await capturedCallback({
      uid: 'u1',
      email: null,
      getIdToken: () => Promise.resolve('tok'),
    });
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().sessionError).toBe('session error');
    expect(firebaseSignOut).toHaveBeenCalled();
  });
});
