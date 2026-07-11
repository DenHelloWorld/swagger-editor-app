import { describe, it, expect } from 'vitest';
import { getValidLocale, isHistoryPath } from '@/i18n/locale';

describe('locale helpers', () => {
  it('returns a valid locale or the default', () => {
    expect(getValidLocale('ru')).toBe('ru');
    expect(getValidLocale('fr')).toBe('en');
    expect(getValidLocale(undefined)).toBe('en');
  });

  it('detects history paths', () => {
    expect(isHistoryPath('/history')).toBe(true);
    expect(isHistoryPath('/history/rec-1')).toBe(true);
    expect(isHistoryPath('/en/history')).toBe(false);
    expect(isHistoryPath('/about')).toBe(false);
  });
});
