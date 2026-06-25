import { Badge } from '@/components/ui/badge';
import styles from './MethodBadge.module.css';

type Props = {
  method: string;
};

export function MethodBadge({ method }: Props) {
  const modifier =
    styles[`badge--${method.toLowerCase()}`] ?? styles['badge--default'];

  return (
    <Badge className={`${styles.badge} ${modifier}`}>
      {method.toUpperCase()}
    </Badge>
  );
}
