'use client';

import { useTranslation } from 'react-i18next';
import styles from './ExampleBlock.module.css';

type Props = {
  example: object;
};

export function ExampleBlock({ example }: Props) {
  const { t } = useTranslation();
  return (
    <div className={styles.example}>
      <p className={styles.example__title}>{t('viewer.example.title')}</p>
      <pre className={styles.example__code}>
        {JSON.stringify(example, null, 2)}
      </pre>
    </div>
  );
}
