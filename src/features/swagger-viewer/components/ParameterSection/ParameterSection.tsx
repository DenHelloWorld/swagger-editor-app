'use client';

import { useTranslation } from 'react-i18next';
import type { ResolvedParameter } from '@/types/openapi';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getParamType } from '@/utils/openapi';
import styles from './ParameterSection.module.css';

type Props = {
  parameters: ResolvedParameter[];
};

export function ParameterSection({ parameters }: Props) {
  const { t } = useTranslation();
  return (
    <div className={styles.root}>
      <p className={styles.title}>{t('viewer.parameters.title')}</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('viewer.table.name')}</TableHead>
            <TableHead>{t('viewer.table.description')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {parameters.map((param) => (
            <TableRow key={`${param.name}-${param.in}`}>
              <TableCell className={styles.cell}>
                <div className={styles.cell__header}>
                  <p className={styles.cell__name}>{param.name}</p>
                  {param.required && (
                    <span className={styles.cell__required}>
                      {t('viewer.table.required')}
                    </span>
                  )}
                </div>

                <p className={styles.cell__type}>
                  {getParamType(param)} ({param.in})
                </p>
              </TableCell>

              <TableCell className={styles.cell__desc}>
                {param.description}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
