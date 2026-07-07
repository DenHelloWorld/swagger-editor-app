import { Spinner } from '@/components/ui/spinner';

export default function HistoryLoading() {
  return (
    <section className="flex w-full max-w-3xl flex-col items-center justify-center gap-3 px-4 py-24">
      <Spinner className="size-8" />
      <p className="text-muted-foreground text-sm">Loading...</p>
    </section>
  );
}
