import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { OpenAPIOperation, OpenAPIPathItem } from '@/types/openapi';
import { mergeParameters } from '@/utils/openapi';
import { MethodBadge } from '../MethodBadge/MethodBadge';
import { ParameterSection } from '../ParameterSection/ParameterSection';
import styles from './EndpointItem.module.css';

type Props = {
  method: string;
  path: string;
  operation: OpenAPIOperation;
  pathItem: OpenAPIPathItem;
};

export function EndpointItem({ method, path, operation, pathItem }: Props) {
  const rowModifier = styles[`row--${method.toLowerCase()}`];
  const parameters = mergeParameters(
    pathItem.parameters ?? [],
    operation.parameters ?? [],
  );

  return (
    <AccordionItem value={`${method}-${path}`} className={styles.item}>
      <AccordionTrigger className={`${styles.row} ${rowModifier ?? ''}`}>
        <div className={styles.row__body}>
          <MethodBadge method={method} />
          {operation.summary && <span>{operation.summary}</span>}
        </div>
      </AccordionTrigger>
      <AccordionContent className={styles.content}>
        {operation.description && (
          <p className={styles.description}>{operation.description}</p>
        )}
        {!!parameters.length && <ParameterSection parameters={parameters} />}
      </AccordionContent>
    </AccordionItem>
  );
}
