// TODO(#61): replace mock with real Firestore persistence.
// See src/lib/db/firebase/client.ts -> getFirebaseFirestore()
import { SavedSchema } from '@/types/dbTypes';

const schemas = new Map<string, SavedSchema>();

export async function saveUserSchema(schema: SavedSchema) {
  // TODO(#61): setDoc(doc(getFirebaseFirestore(), 'schemas', schema.userId), schema)
  schemas.set(schema.userId, schema);
}

export async function getUserSchema(
  userId: string,
): Promise<SavedSchema | null> {
  // TODO(#61): getDoc(doc(getFirebaseFirestore(), 'schemas', userId))
  return schemas.get(userId) ?? null;
}
