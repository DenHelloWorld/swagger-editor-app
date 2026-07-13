// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { FirebaseError } from 'firebase/app';
import { getAuthErrorMessage } from './getAuthErrorMessage';

describe('getAuthErrorMessage', () => {
  it('returns mapped key for known firebase error code', () => {
    const error = new FirebaseError('auth/invalid-email', 'Invalid email');
    expect(getAuthErrorMessage(error)).toBe('auth.errors.invalidEmail');
  });

  it('returns mapped key for user-not-found', () => {
    const error = new FirebaseError('auth/user-not-found', 'not found');
    expect(getAuthErrorMessage(error)).toBe('auth.errors.invalidCredential');
  });

  it('returns default key for unknown firebase error code', () => {
    const error = new FirebaseError('auth/unknown-error', 'unknown');
    expect(getAuthErrorMessage(error)).toBe('auth.errors.generic');
  });

  it('returns default key for non-firebase error', () => {
    expect(getAuthErrorMessage(new Error('random'))).toBe(
      'auth.errors.generic',
    );
  });

  it('returns default key for non-error value', () => {
    expect(getAuthErrorMessage('string error')).toBe('auth.errors.generic');
  });
});
