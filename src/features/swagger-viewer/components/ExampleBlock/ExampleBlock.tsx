import styles from './ExampleBlock.module.css';

type Props = {
  example: object;
};

export function ExampleBlock({ example }: Props) {
  return (
    <div className={styles.example}>
      <p className={styles.example__title}>Example</p>
      <pre className={styles.example__code}>
        {JSON.stringify(example, null, 2)}
      </pre>
    </div>
  );
}
