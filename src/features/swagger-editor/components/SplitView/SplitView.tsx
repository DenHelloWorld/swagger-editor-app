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
      style={{
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        height: '100vh',
        width: '100%',
      }}
    >
      <div style={{ flex: 1, overflow: 'auto' }}>{left}</div>
      <div style={{ flex: 1, overflow: 'auto' }}>{right}</div>
    </div>
  );
}
