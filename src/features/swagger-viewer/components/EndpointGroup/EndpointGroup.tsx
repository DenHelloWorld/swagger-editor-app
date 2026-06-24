import { Accordion } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { OpenAPIPathItem } from '@/types/openapi';
import { HTTP_METHODS } from '@/constants/openapi';
import { EndpointItem } from '../EndpointItem/EndpointItem';
import styles from './EndpointGroup.module.css';

type Props = {
  path: string;
  pathItem: OpenAPIPathItem | undefined;
};

export function EndpointGroup({ path, pathItem }: Props) {
  return (
    <Card>
      <CardHeader>
        <Badge variant="outline" className={styles.header__badge}>
          {path}
        </Badge>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple">
          <ul>
            {Object.entries(pathItem ?? {})
              .filter(([method]) => HTTP_METHODS.has(method))
              .map(([method, operation]) => (
                <li key={method}>
                  <EndpointItem
                    method={method}
                    path={path}
                    operation={operation}
                  />
                </li>
              ))}
          </ul>
        </Accordion>
      </CardContent>
    </Card>
  );
}
