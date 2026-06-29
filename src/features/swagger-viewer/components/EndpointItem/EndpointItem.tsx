import type { ProcessedEndpoint } from '@/types/openapi';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { MethodBadge } from '../MethodBadge/MethodBadge';
import { ParameterSection } from '../ParameterSection/ParameterSection';
import { RequestBodySection } from '../RequestBodySection/RequestBodySection';
import styles from './EndpointItem.module.css';

type Props = {
  endpoint: ProcessedEndpoint;
};

export function EndpointItem({ endpoint }: Props) {
  const { method, path, summary, description, parameters, requestBody } =
    endpoint;
  const rowModifier = styles[`row--${method.toLowerCase()}`];

  return (
    <AccordionItem value={`${method}-${path}`} className={styles.item}>
      <AccordionTrigger className={`${styles.row} ${rowModifier ?? ''}`}>
        <div className={styles.row__body}>
          <MethodBadge method={method} />
          {summary && <span>{summary}</span>}
        </div>
      </AccordionTrigger>
      <AccordionContent className={styles.content}>
        {description && <p className={styles.description}>{description}</p>}
        {!!parameters.length && <ParameterSection parameters={parameters} />}
        {requestBody && <RequestBodySection requestBody={requestBody} />}
      </AccordionContent>
    </AccordionItem>
  );
}
