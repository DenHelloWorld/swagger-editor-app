import { Separator } from '@/components/ui/separator';
import { TeamMemberCard } from '@/features/about/components/TeamMemberCard/TeamMemberCard';
import { TechCard } from '@/features/about/components/TechCard/TechCard';
import { team } from '@/features/about/data/team';
import { techStack } from '@/features/about/data/techStack';
import { aboutContent } from '@/features/about/content';
import styles from './page.module.css';

export default function About() {
  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <h1 className={styles.section__title}>{aboutContent.title}</h1>
        <p className={styles.section__text}>
          {aboutContent.introBeforeLink}{' '}
          <a
            href="https://rs.school/courses/reactjs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline-offset-4 hover:underline"
          >
            {aboutContent.introLinkText}
          </a>
          {aboutContent.introAfterLink}
        </p>
        <p className={styles.section__text}>{aboutContent.description}</p>
      </div>

      <Separator />

      <div className={styles.section}>
        <h2 className={styles.section__title}>{aboutContent.builtWithTitle}</h2>
        <div className={styles.stack}>
          {techStack.map((tech) => (
            <TechCard key={tech.name} {...tech} />
          ))}
        </div>
      </div>

      <Separator />

      <div className={styles.section}>
        <h2 className={styles.section__title}>{aboutContent.teamTitle}</h2>
        <div className={styles.team}>
          {team.map((member) => (
            <TeamMemberCard key={member.githubUrl} {...member} />
          ))}
        </div>
      </div>
    </div>
  );
}
