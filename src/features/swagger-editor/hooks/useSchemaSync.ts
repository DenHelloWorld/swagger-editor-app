import { useEffect, useRef } from 'react';
import { useSchemaStore } from '@/store/schemaStore';
import { parseSchema, validateSchema, processSpec } from '@/utils/openapi';
import { toast } from 'sonner';

export const useSchemaSync = () => {
  const { raw, format, setFormat, setSpec, setErrors } = useSchemaStore();
  const hadUnexpectedError = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!raw.trim()) {
        setSpec(null);
        setErrors([]);
        hadUnexpectedError.current = false;
        return;
      }

      const parsed = parseSchema(raw);
      if (!parsed.success) {
        setSpec(null);
        setErrors([parsed.error]);
        hadUnexpectedError.current = false;
        return;
      }

      if (parsed.format !== format) {
        setFormat(parsed.format);
      }

      validateSchema(parsed.doc)
        .then((result) => {
          hadUnexpectedError.current = false;
          if (!result.valid) {
            setSpec(null);
            setErrors(result.errors);
          } else {
            setSpec(processSpec(result.doc));
            setErrors([]);
          }
        })
        .catch(() => {
          setSpec(null);
          setErrors(['Validation is temporarily unavailable']);

          if (!hadUnexpectedError.current) {
            hadUnexpectedError.current = true;
            toast.error(
              'Something went wrong while validating your schema. Your edits are safe.',
            );
          }
        });
    }, 500);

    return () => clearTimeout(timer);
  }, [raw, format]);
};
