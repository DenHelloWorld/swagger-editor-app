import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import type { OpenAPIDocument } from '@/types/openapi';
import { FileCode2 } from 'lucide-react';
import { EndpointGroup } from '../EndpointGroup/EndpointGroup';
import styles from './EndpointList.module.css';

type Props = {
  spec: OpenAPIDocument | null;
};

function EmptyState() {
  return (
    <Card className={styles.list__empty}>
      <CardContent className={styles.list__empty_content}>
        <FileCode2 className={styles.list__empty_icon} />
        <p className={styles.list__empty_title}>No schema loaded</p>
        <p className={styles.list__empty_hint}>
          Paste or upload an OpenAPI schema in the editor to see endpoints here.
        </p>
      </CardContent>
    </Card>
  );
}

export function EndpointList({ spec }: Props) {
  if (!spec?.paths) {
    return <EmptyState />;
  }

  return (
    <ScrollArea className={styles.list}>
      <ul className={styles.list__inner}>
        {Object.entries(spec.paths).map(([path, pathItem]) => (
          <li key={path}>
            <EndpointGroup path={path} pathItem={pathItem} />
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}
