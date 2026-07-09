import { describe, it, expect } from 'vitest';
import { FirebaseError } from 'firebase/app';
import { getAuthErrorMessage } from './getAuthErrorMessage';

describe('getAuthErrorMessage', () => {
  it('returns mapped message for known firebase error code', () => {
    const error = new FirebaseError('auth/invalid-email', 'Invalid email');
    expect(getAuthErrorMessage(error)).toBe(
      'Please enter a valid email address.',
    );
  });

  it('returns mapped message for user-not-found', () => {
    const error = new FirebaseError('auth/user-not-found', 'not found');
    expect(getAuthErrorMessage(error)).toBe('Incorrect email or password.');
  });

  it('returns default message for unknown firebase error code', () => {
    const error = new FirebaseError('auth/unknown-error', 'unknown');
    expect(getAuthErrorMessage(error)).toBe(
      'Something went wrong. Please try again.',
    );
  });

  it('returns default message for non-firebase error', () => {
    expect(getAuthErrorMessage(new Error('random'))).toBe(
      'Something went wrong. Please try again.',
    );
  });

  it('returns default message for non-error value', () => {
    expect(getAuthErrorMessage('string error')).toBe(
      'Something went wrong. Please try again.',
    );
  });
});
