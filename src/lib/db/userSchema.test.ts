// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { SavedSchema } from '@/types/dbTypes';

const setDoc = vi.fn();
const getDoc = vi.fn();
const doc = vi.fn((...args: unknown[]) => args);

vi.mock('firebase/firestore', () => ({
  doc: (...args: unknown[]) => doc(...args),
  setDoc: (...args: unknown[]) => setDoc(...args),
  getDoc: (...args: unknown[]) => getDoc(...args),
}));

vi.mock('./firebase/client', () => ({
  getFirebaseFirestore: () => ({ kind: 'db' }),
}));

import { saveUserSchema, getUserSchema } from './userSchema';

describe('userSchema', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const schema: SavedSchema = {
    userId: 'u1',
    content: '{}',
    format: 'json',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };

  it('saves a schema', async () => {
    setDoc.mockResolvedValue(undefined);
    await saveUserSchema(schema);
    expect(setDoc).toHaveBeenCalled();
  });

  it('throws a wrapped error when save fails', async () => {
    setDoc.mockRejectedValue(new Error('boom'));
    await expect(saveUserSchema(schema)).rejects.toThrow(
      'Failed to save schema: boom',
    );
  });

  it('returns schema data when it exists', async () => {
    getDoc.mockResolvedValue({ exists: () => true, data: () => schema });
    const result = await getUserSchema('u1');
    expect(result).toEqual(schema);
  });

  it('returns null when it does not exist', async () => {
    getDoc.mockResolvedValue({ exists: () => false, data: () => undefined });
    const result = await getUserSchema('u1');
    expect(result).toBeNull();
  });

  it('throws a wrapped error when load fails', async () => {
    getDoc.mockRejectedValue(new Error('nope'));
    await expect(getUserSchema('u1')).rejects.toThrow(
      'Failed to load schema: nope',
    );
  });

  it('throws a wrapped unknown error when save fails with non-Error', async () => {
    setDoc.mockRejectedValue('non-error-failure');
    await expect(saveUserSchema(schema)).rejects.toThrow(
      'Failed to save schema: unknown error',
    );
  });

  it('throws a wrapped unknown error when load fails with non-Error', async () => {
    getDoc.mockRejectedValue('non-error-failure');
    await expect(getUserSchema('u1')).rejects.toThrow(
      'Failed to load schema: unknown error',
    );
  });
});
