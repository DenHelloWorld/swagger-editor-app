import { LoadingIndicator } from '@/components/ui/loading-indicator';

export default function HistoryLoading() {
  return (
    <section className="flex w-full max-w-3xl items-center justify-center px-4 py-24">
      <LoadingIndicator size="lg" />
    </section>
  );
}
