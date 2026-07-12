'use client';

import { useTranslation } from 'react-i18next';
import { Section } from '@/features/about/components/Section/Section';
import { TeamMemberCard } from '@/features/about/components/TeamMemberCard/TeamMemberCard';
import { TechCard } from '@/features/about/components/TechCard/TechCard';
import { team } from '@/features/about/data/team';
import { techStack } from '@/features/about/data/techStack';
import styles from './page.module.css';

export default function About() {
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <Section as="h1" title={t('about.title')}>
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
      </Section>

      <Section title={t('about.builtWithTitle')}>
        <div className={styles.stack}>
          {techStack.map((tech) => (
            <TechCard key={tech.name} {...tech} />
          ))}
        </div>
      </Section>

      <Section title={t('about.teamTitle')}>
        <div className={styles.team}>
          {team.map((member) => (
            <TeamMemberCard key={member.githubUrl} {...member} />
          ))}
        </div>
      </Section>
    </div>
  );
}
