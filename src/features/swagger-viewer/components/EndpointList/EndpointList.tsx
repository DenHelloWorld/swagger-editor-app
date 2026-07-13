'use client';

import { useTranslation } from 'react-i18next';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import type { ProcessedSpec } from '@/types/openapi';
import { FileCode2 } from 'lucide-react';
import { useScrollSync } from '@/hooks/useScrollSync';
import { EndpointGroup } from '../EndpointGroup/EndpointGroup';
import styles from './EndpointList.module.css';

type Props = { spec: ProcessedSpec | null };

function EmptyState() {
  const { t } = useTranslation();
  return (
    <Card className={styles.list__empty}>
      <CardContent className={styles.list__empty_content}>
        <FileCode2 className={styles.list__empty_icon} />
        <p className={styles.list__empty_title}>
          {t('viewer.emptyState.title')}
        </p>
        <p className={styles.list__empty_hint}>{t('viewer.emptyState.hint')}</p>
      </CardContent>
    </Card>
  );
}

export function EndpointList({ spec }: Props) {
  const scrollRef = useScrollSync();

  if (!spec) {
    return <EmptyState />;
  }

  return (
    <ScrollArea className={styles.list} viewportRef={scrollRef}>
      <ul className={styles.list__inner}>
        {spec.groups.map((group) => (
          <li key={group.path}>
            <EndpointGroup group={group} />
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}
