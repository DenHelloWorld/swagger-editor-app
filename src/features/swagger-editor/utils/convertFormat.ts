import * as yaml from 'js-yaml';

export function convertFormat(
  raw: string,
  targetFormat: 'json' | 'yaml',
): string {
  let obj: unknown;

  try {
    obj = JSON.parse(raw);
  } catch {
    obj = yaml.load(raw);
  }

  if (targetFormat === 'yaml') {
    return yaml.dump(obj);
  } else {
    return JSON.stringify(obj, null, 2);
  }
}
