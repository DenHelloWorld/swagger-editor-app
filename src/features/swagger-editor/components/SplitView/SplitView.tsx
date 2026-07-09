'use client';

import { useEffect, useState } from 'react';
import styles from './SplitView.module.css';

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
      className={`${styles.split} ${!isHorizontal ? styles['split--vertical'] : ''}`}
    >
      <div className={styles.split__panel}>{left}</div>
      <div className={styles.split__panel}>{right}</div>
    </div>
  );
}
