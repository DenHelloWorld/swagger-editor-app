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
  return (
    <div className={styles.root}>
      <p className={styles.title}>Parameters</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {parameters.map((param) => (
            <TableRow key={`${param.name}-${param.in}`}>
              <TableCell className={styles.cell}>
                <div className={styles.cell__header}>
                  <p className={styles.cell__name}>{param.name}</p>
                  {param.required && (
                    <span className={styles.cell__required}>* required</span>
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
