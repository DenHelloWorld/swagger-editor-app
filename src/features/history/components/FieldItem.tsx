interface FieldItemProps {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  valueClassName?: string;
}

export function FieldItem({
  label,
  value,
  mono = false,
  valueClassName = 'text-sm',
}: FieldItemProps) {
  return (
    <div>
      <p className="text-muted-foreground text-xs tracking-wide uppercase">
        {label}
      </p>
      <p
        className={`mt-1 ${mono ? 'font-mono break-all' : 'font-medium'} ${valueClassName}`}
      >
        {value}
      </p>
    </div>
  );
}
