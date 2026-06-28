import { Accordion } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { ProcessedGroup } from '@/types/openapi';
import { EndpointItem } from '../EndpointItem/EndpointItem';
import styles from './EndpointGroup.module.css';

type Props = {
  group: ProcessedGroup;
};

export function EndpointGroup({ group }: Props) {
  return (
    <Card>
      <CardHeader>
        <Badge variant="outline" className={styles.header__badge}>
          {group.path}
        </Badge>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className={styles.accordion}>
          {group.endpoints.map((endpoint) => (
            <EndpointItem
              key={`${endpoint.method}-${endpoint.path}`}
              endpoint={endpoint}
            />
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
