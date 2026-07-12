import { ReactNode } from 'react';
import styles from './Section.module.css';

type Props = {
  title: string;
  children: ReactNode;
  as?: 'h1' | 'h2';
};

export function Section({ title, children, as: Heading = 'h2' }: Props) {
  return (
    <div className={styles.section}>
      <Heading className={styles.section__title}>{title}</Heading>
      {children}
    </div>
  );
}
