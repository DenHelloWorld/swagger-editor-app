import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { OpenAPIOperation } from '@/types/openapi';
import { MethodBadge } from '../MethodBadge/MethodBadge';
import styles from './EndpointItem.module.css';

type Props = {
  method: string;
  path: string;
  operation: OpenAPIOperation;
};

export function EndpointItem({ method, path, operation }: Props) {
  const rowModifier = styles[`row--${method.toLowerCase()}`];

  return (
    <AccordionItem value={`${method}-${path}`}>
      <AccordionTrigger className={`${styles.row} ${rowModifier ?? ''}`}>
        <div className={styles.row__body}>
          <MethodBadge method={method} />
          {operation.summary && <span>{operation.summary}</span>}
        </div>
      </AccordionTrigger>
      <AccordionContent className={styles.content}>
        {operation.description ?? 'No description provided.'}
      </AccordionContent>
    </AccordionItem>
  );
}
