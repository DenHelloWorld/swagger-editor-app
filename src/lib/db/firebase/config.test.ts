import { describe, it, expect } from 'vitest';
import { firebaseConfig, isFirebaseConfigured } from './config';

describe('firebaseConfig', () => {
  it('reads values from env vars', () => {
    expect(firebaseConfig).toHaveProperty('apiKey');
    expect(firebaseConfig).toHaveProperty('projectId');
  });
});

describe('isFirebaseConfigured', () => {
  it('returns false when config values are missing', () => {
    expect(isFirebaseConfigured()).toBe(false);
  });

  it('returns true when all config values are present', () => {
    const original = { ...firebaseConfig };
    Object.assign(firebaseConfig, {
      apiKey: 'a',
      authDomain: 'b',
      projectId: 'c',
      storageBucket: 'd',
      messagingSenderId: 'e',
      appId: 'f',
    });
    expect(isFirebaseConfigured()).toBe(true);
    Object.assign(firebaseConfig, original);
  });
});
