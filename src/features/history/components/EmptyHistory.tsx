import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default function EmptyHistory() {
  return (
    <Card className="w-full max-w-3xl px-4 py-8">
      <CardContent className="flex flex-col items-center gap-4 px-6 py-12 text-center">
        <div className="max-w-md space-y-2">
          <p className="text-base font-medium">
            You haven&apos;t executed any requests yet.
          </p>
          <p className="text-muted-foreground text-sm">
            Use the Editor to define your OpenAPI schema and the Viewer to send
            requests. Executed requests will appear here automatically.
          </p>
        </div>

        <Button variant="outline" size="sm" asChild className="mt-2">
          <Link href="/">
            Go to Editor &amp; Viewer
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
