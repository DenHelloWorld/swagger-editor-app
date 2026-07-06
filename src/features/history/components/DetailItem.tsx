export function DetailItem({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-muted-foreground text-xs tracking-wide uppercase">
        {label}
      </dt>
      <dd
        className={`mt-1 text-sm ${mono ? 'font-mono break-all' : 'font-medium'}`}
      >
        {value}
      </dd>
    </div>
  );
}
