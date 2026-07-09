import { FieldItem } from './FieldItem';

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
      <dt className="sr-only">{label}</dt>
      <dd>
        <FieldItem label={label} value={value} mono={mono} />
      </dd>
    </div>
  );
}
