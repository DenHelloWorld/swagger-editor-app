import { useEffect } from 'react';
import { useSchemaStore } from '@/store/schemaStore';
import { parseSchema } from '@/lib/parseSchema';
import { validateSchema } from '@/lib/validateSchema';

export const useSchemaSync = () => {
  const { raw, format, setFormat, setSpec, setErrors } = useSchemaStore();

  useEffect(() => {
    if (!raw.trim()) {
      setSpec(null);
      setErrors([]);
      return;
    }

    const parsed = parseSchema(raw);
    if (!parsed.success) {
      setSpec(null);
      setErrors([parsed.error]);
      return;
    }

    if (parsed.format !== format) {
      setFormat(parsed.format);
    }

    validateSchema(parsed.doc).then((result) => {
      if (!result.valid) {
        setSpec(null);
        setErrors(result.errors);
      } else {
        setSpec(parsed.doc);
        setErrors([]);
      }
    });
  }, [raw]);
};
