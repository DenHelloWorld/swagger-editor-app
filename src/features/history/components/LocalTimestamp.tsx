'use client';

import dynamic from 'next/dynamic';
import { formatTimestamp } from '../utils/recordFormat';

type Props = {
  value: string;
};

function LocalTimestampText({ value }: Props) {
  return <>{formatTimestamp(value)}</>;
}

export const LocalTimestamp = dynamic(
  () => Promise.resolve(LocalTimestampText),
  { ssr: false },
);
