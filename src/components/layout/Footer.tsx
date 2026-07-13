'use client';

import Link from 'next/link';
import { Info, GraduationCap } from 'lucide-react';
import { Button } from '../ui/button';
import { useActivePath } from '@/hooks/useActivePath';
import styles from './Footer.module.css';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const isActive = useActivePath();
  const isAboutActive = isActive('/about');
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__bar}>
        <Button variant="ghost" size="sm" asChild>
          <Link
            href="/about"
            aria-current={isAboutActive ? 'page' : undefined}
            className={isAboutActive ? styles['footer__link--active'] : ''}
          >
            <Info data-icon="inline-start" />
            {t('header.about')}
          </Link>
        </Button>
        <p className={styles.footer__copyright}>© 2026 The 4 a.m. Tea Club</p>
        <Button variant="ghost" size="sm" asChild>
          <a
            href="https://rs.school/courses/reactjs"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GraduationCap data-icon="inline-start" />
            RS School
          </a>
        </Button>
      </div>
    </footer>
  );
}
