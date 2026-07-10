import { FirebaseError } from 'firebase/app';

const AUTH_ERROR_KEYS: Record<string, string> = {
  'auth/invalid-email': 'auth.errors.invalidEmail',
  'auth/invalid-credential': 'auth.errors.invalidCredential',
  'auth/wrong-password': 'auth.errors.wrongPassword',
  'auth/user-not-found': 'auth.errors.invalidCredential',
  'auth/email-already-in-use': 'auth.errors.emailInUse',
  'auth/weak-password': 'auth.errors.weakPassword',
  'auth/too-many-requests': 'auth.errors.tooManyRequests',
  'auth/user-disabled': 'auth.errors.userDisabled',
  'auth/network-request-failed': 'auth.errors.networkError',
  'auth/operation-not-allowed': 'auth.errors.operationNotAllowed',
};

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    return AUTH_ERROR_KEYS[error.code] ?? 'auth.errors.generic';
  }

  return 'auth.errors.generic';
}
