import type { ProcessedRequestBody } from '@/types/openapi';
import { ExampleBlock } from '../ExampleBlock/ExampleBlock';
import { SchemaTable } from '../SchemaTable/SchemaTable';
import styles from './RequestBodySection.module.css';

type Props = {
  requestBody: ProcessedRequestBody;
};

export function RequestBodySection({ requestBody }: Props) {
  const { contentType, required, isArray, properties, example } = requestBody;
  return (
    <div className={styles.root}>
      {contentType ? (
        <div className={styles.header}>
          <p className={styles.title}>Request Body</p>
          <span className={styles.header__type}>
            {contentType}
            {isArray ? ' · array' : ''}
          </span>
          {required && (
            <span className={styles.header__required}>* required</span>
          )}
        </div>
      ) : (
        <div className={styles.header}>
          <p className={styles.title}>Request Body</p>
          {isArray && <span className={styles.header__type}>array</span>}
        </div>
      )}
      <SchemaTable properties={properties} />
      {example !== undefined && <ExampleBlock example={example} />}
    </div>
  );
}
