import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';

const refresh = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh }),
}));

const initI18n = vi.fn(() => ({ kind: 'i18n-instance' }));
vi.mock('@/lib/i18n/config', () => ({
  initI18n: (...args: unknown[]) => initI18n(...args),
}));

vi.mock('react-i18next', () => ({
  I18nextProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const getCookie = vi.fn();
const setCookie = vi.fn();
vi.mock('@/lib/cookies', () => ({
  getCookie: (...args: unknown[]) => getCookie(...args),
  setCookie: (...args: unknown[]) => setCookie(...args),
}));

import { I18nProvider } from './I18nProvider';

describe('I18nProvider', () => {
  const originalLanguage = navigator.language;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'language', {
      value: originalLanguage,
      configurable: true,
    });
  });

  it('renders children', () => {
    getCookie.mockReturnValue('en');
    render(
      <I18nProvider lng="en">
        <span>child</span>
      </I18nProvider>,
    );
    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('does nothing when a language cookie is already set', () => {
    getCookie.mockReturnValue('en');
    render(
      <I18nProvider lng="en">
        <span>child</span>
      </I18nProvider>,
    );
    expect(setCookie).not.toHaveBeenCalled();
    expect(refresh).not.toHaveBeenCalled();
  });

  it('sets cookie and refreshes when browser language is supported and not english', () => {
    getCookie.mockReturnValue(undefined);
    Object.defineProperty(navigator, 'language', {
      value: 'ru-RU',
      configurable: true,
    });
    render(
      <I18nProvider lng="en">
        <span>child</span>
      </I18nProvider>,
    );
    expect(setCookie).toHaveBeenCalledWith('app_language', 'ru');
    expect(refresh).toHaveBeenCalled();
  });

  it('does nothing when browser language is unsupported', () => {
    getCookie.mockReturnValue(undefined);
    Object.defineProperty(navigator, 'language', {
      value: 'fr-FR',
      configurable: true,
    });
    render(
      <I18nProvider lng="en">
        <span>child</span>
      </I18nProvider>,
    );
    expect(setCookie).not.toHaveBeenCalled();
  });
});
