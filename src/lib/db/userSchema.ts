//mock
import { SavedSchema } from '@/types/dbTypes';

const schemas = new Map<string, SavedSchema>();

export async function saveUserSchema(schema: SavedSchema) {
  schemas.set(schema.userId, schema);
}

export async function getUserSchema(
  userId: string,
): Promise<SavedSchema | null> {
  return schemas.get(userId) ?? null;
}
