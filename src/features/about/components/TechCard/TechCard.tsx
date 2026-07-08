import type { TechStackItem } from '../../data/techStack';
import styles from './TechCard.module.css';

export function TechCard({ name, url, iconId, color }: TechStackItem) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
    >
      <svg className={styles.icon} style={{ color }} aria-hidden="true">
        <use href={`/icons.svg#${iconId}`} />
      </svg>
      <span className={styles.name}>{name}</span>
    </a>
  );
}
