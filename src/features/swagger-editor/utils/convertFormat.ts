import * as yaml from 'js-yaml';

export function convertFormat(
  raw: string,
  targetFormat: 'json' | 'yaml',
): string {
  if (targetFormat === 'yaml') {
    const obj = JSON.parse(raw);
    return yaml.dump(obj);
  } else {
    const obj = yaml.load(raw);
    return JSON.stringify(obj, null, 2);
  }
}
