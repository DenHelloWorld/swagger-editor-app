import { useEffect } from 'react';
import { useSchemaStore } from '@/store/schemaStore';
import { parseSchema, validateSchema, processSpec } from '@/utils/openapi';

export const useSchemaSync = () => {
  const { raw, format, setFormat, setSpec, setErrors } = useSchemaStore();

  useEffect(() => {
    const timer = setTimeout(() => {
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

      validateSchema(parsed.doc)
        .then((result) => {
          if (!result.valid) {
            setSpec(null);
            setErrors(result.errors);
          } else {
            setSpec(processSpec(parsed.doc));
            setErrors([]);
          }
        })
        .catch(() => setErrors(['Unexpected validation error']));
    }, 500);

    return () => clearTimeout(timer);
  }, [raw]);
};
