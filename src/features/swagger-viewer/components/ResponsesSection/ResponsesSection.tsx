import type { ProcessedResponse } from '@/types/openapi';
import { Badge } from '@/components/ui/badge';
import { ExampleBlock } from '../ExampleBlock/ExampleBlock';
import { SchemaTable } from '../SchemaTable/SchemaTable';
import styles from './ResponsesSection.module.css';

type Props = {
  responses: ProcessedResponse[];
};

export function ResponsesSection({ responses }: Props) {
  return (
    <div className={styles.root}>
      <p className={styles.title}>Responses</p>
      {responses.map(
        ({
          statusCode,
          description,
          contentType,
          isArray,
          properties,
          example,
        }) => (
          <div key={statusCode} className={styles.response}>
            <div className={styles.response__header}>
              <Badge
                variant="outline"
                className={`${styles.response__status} ${styles[`response__status--${statusCode[0]}`] ?? ''}`}
              >
                {statusCode}
              </Badge>
              {contentType ? (
                <span className={styles.response__type}>
                  {contentType}
                  {isArray ? ' · array' : ''}
                </span>
                ) : (
                  isArray && (
                    <span className={styles.response__type}>array</span>
                  )
              )}
              {description && (
                <span className={styles.response__desc}>{description}</span>
              )}
            </div>
            <SchemaTable properties={properties} />
            {example && <ExampleBlock example={example} />}
          </div>
        ),
      )}
    </div>
  );
}
