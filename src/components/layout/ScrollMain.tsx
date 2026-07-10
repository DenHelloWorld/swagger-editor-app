'use client';

import { useScrollSync } from '@/hooks/useScrollSync';

type Props = {
  className?: string;
  children: React.ReactNode;
};

export function ScrollMain({ className, children }: Props) {
  const scrollRef = useScrollSync();

  return (
    <main ref={scrollRef} className={className}>
      {children}
    </main>
  );
}
