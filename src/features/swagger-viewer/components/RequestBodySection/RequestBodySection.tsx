import type {
  ProcessedRequestBody,
  ProcessedSchemaProperty,
} from '@/types/openapi';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import styles from './RequestBodySection.module.css';

type Props = {
  requestBody: ProcessedRequestBody;
};

function ExampleBlock({ example }: { example: object }) {
  return (
    <div className={styles.example}>
      <p className={styles.example__title}>Example</p>
      <pre className={styles.example__code}>
        {JSON.stringify(example, null, 2)}
      </pre>
    </div>
  );
}

function SchemaTable({
  properties,
}: {
  properties: ProcessedSchemaProperty[];
}) {
  if (!properties.length) return null;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {properties.map(
          ({ name, type, enum: enums, description, required }) => (
            <TableRow key={name}>
              <TableCell className={styles.cell}>
                <div className={styles.cell__header}>
                  <p className={styles.cell__name}>{name}</p>
                  {required && (
                    <span className={styles.cell__required}>* required</span>
                  )}
                </div>
                <p className={styles.cell__type}>
                  {type}
                  {enums ? ` (${enums.join(' | ')})` : ''}
                </p>
              </TableCell>
              <TableCell className={styles.cell__desc}>{description}</TableCell>
            </TableRow>
          ),
        )}
      </TableBody>
    </Table>
  );
}

export function RequestBodySection({ requestBody }: Props) {
  const { contentType, required, properties, example } = requestBody;
  return (
    <div className={styles.root}>
      {contentType ? (
        <div className={styles.header}>
          <p className={styles.title}>Request Body</p>
          <span className={styles.header__type}>{contentType}</span>
          {required && (
            <span className={styles.header__required}>* required</span>
          )}
        </div>
      ) : (
        <p className={styles.title}>Request Body</p>
      )}
      <SchemaTable properties={properties} />
      {example !== undefined && <ExampleBlock example={example} />}
    </div>
  );
}
