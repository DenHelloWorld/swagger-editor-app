import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getFirebaseFirestore } from './firebase/client';

import { SavedSchema } from '@/types/dbTypes';

const SCHEMAS_COLLECTION = 'schemas';

export async function saveUserSchema(schema: SavedSchema): Promise<void> {
  try {
    const db = getFirebaseFirestore();
    const ref = doc(db, SCHEMAS_COLLECTION, schema.userId);
    await setDoc(ref, schema);
  } catch (error) {
    throw new Error(
      `Failed to save schema: ${error instanceof Error ? error.message : 'unknown error'}`,
    );
  }
}

export async function getUserSchema(
  userId: string,
): Promise<SavedSchema | null> {
  try {
    const db = getFirebaseFirestore();
    const ref = doc(db, SCHEMAS_COLLECTION, userId);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as SavedSchema) : null;
  } catch (error) {
    throw new Error(
      `Failed to load schema: ${error instanceof Error ? error.message : 'unknown error'}`,
    );
  }
}
