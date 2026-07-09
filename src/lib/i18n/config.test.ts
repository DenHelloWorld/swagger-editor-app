// @vitest-environment node
import { describe, it, expect } from 'vitest';
import i18n, { initI18n } from './config';

describe('initI18n', () => {
  it('initializes i18n with the given language', () => {
    const instance = initI18n('en');
    expect(instance).toBe(i18n);
    expect(instance.isInitialized).toBe(true);
    expect(instance.language).toBe('en');
  });

  it('changes language when already initialized', () => {
    initI18n('en');
    const instance = initI18n('ru');
    expect(instance.language).toBe('ru');
  });

  it('does nothing new when language is unchanged', () => {
    initI18n('ru');
    const instance = initI18n('ru');
    expect(instance.language).toBe('ru');
  });
});
