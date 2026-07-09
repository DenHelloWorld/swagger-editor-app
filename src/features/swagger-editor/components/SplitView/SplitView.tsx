'use client';

import { useEffect, useState } from 'react';

type Props = {
  left: React.ReactNode;
  right: React.ReactNode;
};

export function SplitView({ left, right }: Props) {
  const [isHorizontal, setIsHorizontal] = useState(true);

  useEffect(() => {
    function checkOrientation() {
      setIsHorizontal(window.innerWidth > window.innerHeight);
    }

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  return (
    <div
      className="h-full w-full self-stretch"
      style={{
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        minHeight: 0,
        gap: '1rem',
        padding: '1rem',
      }}
    >
      <div
        className="bg-background overflow-y-auto rounded-xl border shadow-sm"
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        {left}
      </div>
      <div
        className="bg-background overflow-y-auto rounded-xl border shadow-sm"
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        {right}
      </div>
    </div>
  );
}
