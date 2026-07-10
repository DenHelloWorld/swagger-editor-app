'use client';

import { useTranslation } from 'react-i18next';
import type { ProcessedSchemaProperty } from '@/types/openapi';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import styles from './SchemaTable.module.css';

type Props = {
  properties: ProcessedSchemaProperty[];
};

export function SchemaTable({ properties }: Props) {
  const { t } = useTranslation();
  if (!properties.length) return null;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('viewer.table.name')}</TableHead>
          <TableHead>{t('viewer.table.description')}</TableHead>
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
                    <span className={styles.cell__required}>
                      {t('viewer.table.required')}
                    </span>
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
