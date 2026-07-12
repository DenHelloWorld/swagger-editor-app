import { vi } from 'vitest';
import en from '@/lib/i18n/locales/en.json';

function getNestedValue(source: Record<string, unknown>, key: string): unknown {
  return key.split('.').reduce<unknown>((value, part) => {
    if (value && typeof value === 'object' && part in value) {
      return (value as Record<string, unknown>)[part];
    }
    return undefined;
  }, source);
}

function resolveIcuPlural(template: string, count: number): string {
  const match = template.match(/^\{\w+, plural, ([\s\S]+)}$/);
  if (!match) return template;

  const branches: Record<string, string> = {};
  const branchRegex = /(\w+)\s*\{([^{}]*)}/g;
  let branchMatch: RegExpExecArray | null;
  while ((branchMatch = branchRegex.exec(match[1]))) {
    branches[branchMatch[1]] = branchMatch[2];
  }

  const category = new Intl.PluralRules('en').select(count);
  const text = branches[category] ?? branches.other;
  return text.replace('#', String(count));
}

vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn(),
  getTranslations: async ({
    namespace,
  }: {
    locale: string;
    namespace: keyof typeof en;
  }) => {
    const messages = en[namespace] as Record<string, unknown>;

    return (key: string, values?: { count?: number }) => {
      const value = getNestedValue(messages, key);
      if (typeof value !== 'string') return key;

      if (values?.count !== undefined) {
        return resolveIcuPlural(value, values.count);
      }
      return value;
    };
  },
}));
