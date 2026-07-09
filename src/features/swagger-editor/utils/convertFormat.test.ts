// @vitest-environment node
import { describe, it, expect } from 'vitest';
import * as yaml from 'js-yaml';
import { convertFormat } from './convertFormat';

describe('convertFormat', () => {
  it('converts json to yaml', () => {
    const raw = JSON.stringify({ a: 1, b: 'x' });
    const result = convertFormat(raw, 'yaml');
    expect(yaml.load(result)).toEqual({ a: 1, b: 'x' });
  });

  it('converts yaml to json', () => {
    const raw = 'a: 1\nb: x\n';
    const result = convertFormat(raw, 'json');
    expect(JSON.parse(result)).toEqual({ a: 1, b: 'x' });
  });

  it('keeps json as json when target is json', () => {
    const raw = JSON.stringify({ a: 1 });
    const result = convertFormat(raw, 'json');
    expect(JSON.parse(result)).toEqual({ a: 1 });
  });

  it('keeps yaml as yaml when target is yaml', () => {
    const raw = 'a: 1\n';
    const result = convertFormat(raw, 'yaml');
    expect(yaml.load(result)).toEqual({ a: 1 });
  });
});
