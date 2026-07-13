import { useState } from 'react';
import { useAuth } from '@/features/auth/useAuth';
import { useSchemaStore } from '@/store/schemaStore';
import { saveUserSchema } from '@/lib/db/userSchema';
import { parseSchema, validateSchema } from '@/utils/openapi';

type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

export function useSchemaSave() {
  const { user, isAuthenticated } = useAuth();
  const raw = useSchemaStore((s) => s.raw);
  const errors = useSchemaStore((s) => s.errors);
  const processedSpec = useSchemaStore((s) => s.processedSpec);

  const [status, setStatus] = useState<SaveStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const isValid = errors.length === 0 && processedSpec !== null;

  const save = async () => {
    if (!user || status === 'saving') return;

    setStatus('saving');
    setError(null);

    const parsed = parseSchema(raw);
    if (!parsed.success) {
      setStatus('error');
      setError(parsed.error);
      return;
    }

    const result = await validateSchema(parsed.doc);
    if (!result.valid) {
      setStatus('error');
      setError(result.errors[0] ?? 'Schema is invalid');
      return;
    }

    try {
      await saveUserSchema({
        userId: user.uid,
        content: raw,
        format: parsed.format,
        updatedAt: new Date().toISOString(),
      });
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to save schema');
    }
  };

  return { isAuthenticated, isValid, status, error, save };
}
