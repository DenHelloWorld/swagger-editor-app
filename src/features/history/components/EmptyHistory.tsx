import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import styles from './EmptyHistory.module.css';

export default function EmptyHistory() {
  return (
    <Card className={styles.empty}>
      <CardContent className={styles.empty__content}>
        <div className={styles.empty__text}>
          <p className={styles.empty__title}>
            You haven&apos;t executed any requests yet.
          </p>
          <p className={styles.empty__hint}>
            Use the Editor to define your OpenAPI schema and the Viewer to send
            requests. Executed requests will appear here automatically.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          asChild
          className={styles.empty__cta}
        >
          <Link href="/">
            Go to Editor &amp; Viewer
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
