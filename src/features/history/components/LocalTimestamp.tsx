'use client';

import dynamic from 'next/dynamic';
import { formatTimestamp } from '../utils/recordFormat';

type Props = {
  value: string;
};

function LocalTimestampText({ value }: Props) {
  return <>{formatTimestamp(value)}</>;
}

function LocalTimestampFallback() {
  return (
    <span className="text-muted-foreground" aria-hidden="true">
      …
    </span>
  );
}

export const LocalTimestamp = dynamic(
  () => Promise.resolve(LocalTimestampText),
  {
    ssr: false,
    loading: LocalTimestampFallback,
  },
);

