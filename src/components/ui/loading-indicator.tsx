import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';

type Props = {
  size?: 'sm' | 'lg';
  className?: string;
};

export function LoadingIndicator({ size = 'sm', className }: Props) {
  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <Spinner className={size === 'lg' ? 'size-8' : 'size-5'} />
    </div>
  );
}
