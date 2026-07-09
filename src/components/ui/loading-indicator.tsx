import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';

type Props = {
  text?: string;
  size?: 'sm' | 'lg';
  className?: string;
};

export function LoadingIndicator({
  text = 'Loading...',
  size = 'sm',
  className,
}: Props) {
  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <Spinner className={size === 'lg' ? 'size-8' : 'size-5'} />
      {text && <span className="text-muted-foreground text-sm">{text}</span>}
    </div>
  );
}
