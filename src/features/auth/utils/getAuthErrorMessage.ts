import { FirebaseError } from 'firebase/app';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/user-not-found': 'Incorrect email or password.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password must be at least 8 characters.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/network-request-failed':
    'Network error. Check your connection and try again.',
  'auth/operation-not-allowed': 'Sign-in is temporarily unavailable.',
};

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    return (
      AUTH_ERROR_MESSAGES[error.code] ??
      'Something went wrong. Please try again.'
    );
  }

  return 'Something went wrong. Please try again.';
}
