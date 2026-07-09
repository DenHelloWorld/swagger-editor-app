import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageToggle } from './LanguageToggle';
import { setCookie } from '@/lib/cookies';

const changeLanguage = vi.fn();

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: { language: 'en', changeLanguage },
  }),
}));
vi.mock('@/lib/cookies', () => ({ setCookie: vi.fn() }));

describe('LanguageToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows current language and switches on select', async () => {
    const user = userEvent.setup();
    render(<LanguageToggle />);
    expect(screen.getByText('EN')).toBeInTheDocument();

    await user.click(screen.getByText('EN'));
    const option = await screen.findByText('Русский');
    await user.click(option);

    expect(changeLanguage).toHaveBeenCalledWith('ru');
    expect(setCookie).toHaveBeenCalledWith('app_language', 'ru');
  });
});
