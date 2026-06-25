//mock
import { SavedSchema } from '@/types/dbTypes';

const schemas = new Map<string, SavedSchema>();

export function saveUserSchema(schema: SavedSchema) {
  if (schemas.has(schema.userId)) {
    schemas.delete(schema.userId);
  }
  schemas.set(schema.userId, schema);
}

export function getUserSchema(userId: string): SavedSchema | null {
  return schemas.get(userId) ?? null;
}
