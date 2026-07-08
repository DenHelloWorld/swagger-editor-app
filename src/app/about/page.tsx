'use client';

import { useTranslation } from 'react-i18next';
import { Separator } from '@/components/ui/separator';
import { TeamMemberCard } from '@/features/about/components/TeamMemberCard/TeamMemberCard';
import { TechCard } from '@/features/about/components/TechCard/TechCard';
import { team } from '@/features/about/data/team';
import { techStack } from '@/features/about/data/techStack';
import styles from './page.module.css';

export default function About() {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <h1 className={styles.section__title}>{t('about.title')}</h1>
        <p className={styles.section__text}>
          {t('about.introBeforeLink')}{' '}
          <a
            href="https://rs.school/courses/reactjs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline-offset-4 hover:underline"
          >
            {t('about.introLinkText')}
          </a>
          {t('about.introAfterLink')}
        </p>
        <p className={styles.section__text}>{t('about.description')}</p>
      </div>

      <Separator />

      <div className={styles.section}>
        <h2 className={styles.section__title}>{t('about.builtWithTitle')}</h2>
        <div className={styles.stack}>
          {techStack.map((tech) => (
            <TechCard key={tech.name} {...tech} />
          ))}
        </div>
      </div>

      <Separator />

      <div className={styles.section}>
        <h2 className={styles.section__title}>{t('about.teamTitle')}</h2>
        <div className={styles.team}>
          {team.map((member) => (
            <TeamMemberCard key={member.githubUrl} {...member} />
          ))}
        </div>
      </div>
    </div>
  );
}
