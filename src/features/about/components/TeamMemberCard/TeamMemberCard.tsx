import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { TeamMember } from '../../types';
import { aboutContent } from '../../content';
import styles from './TeamMemberCard.module.css';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function TeamMemberCard({
  name,
  role,
  bio,
  githubUrl,
  linkedinUrl,
}: TeamMember) {
  return (
    <Card className={styles.card}>
      <CardHeader className={styles.header}>
        <Avatar size="lg">
          <AvatarImage src={`${githubUrl}.png`} alt={name} />
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
        <div className={styles.identity}>
          <CardTitle>{name}</CardTitle>
          <CardDescription>
            <Badge variant="secondary">{role}</Badge>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className={styles.bio}>{bio}</p>
      </CardContent>
      <CardFooter className={styles.footer}>
        <Button variant="ghost" size="sm" className={styles.link} asChild>
          <a href={githubUrl} target="_blank" rel="noopener noreferrer">
            <svg className={styles.icon} aria-hidden="true">
              <use href="/icons.svg#github" />
            </svg>
            {aboutContent.githubLinkLabel}
          </a>
        </Button>
        {linkedinUrl && (
          <Button variant="ghost" size="sm" className={styles.link} asChild>
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
              <svg className={styles.icon} aria-hidden="true">
                <use href="/icons.svg#linkedin" />
              </svg>
              {aboutContent.linkedinLinkLabel}
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
