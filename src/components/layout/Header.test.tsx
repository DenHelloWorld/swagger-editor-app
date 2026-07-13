import { toast } from 'sonner';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const replace = vi.fn();
let pathname = '/';
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
  usePathname: () => pathname,
}));

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => (
    <span role="img" aria-label={props.alt as string} />
  ),
}));

vi.mock('sonner', async () => {
  const { mockToast } = await import('@/test/mocks/sonner');
  return { toast: mockToast };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@/components/layout/LanguageToggle', () => ({
  LanguageToggle: () => <div>LanguageToggle</div>,
}));

const mockUseAuth = {
  isAuthenticated: false,
  signOut: vi.fn(),
  isLoading: false,
};
vi.mock('@/features/auth/useAuth', () => ({
  useAuth: () => mockUseAuth,
}));

import Header from './Header';

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    pathname = '/';
    mockUseAuth.isAuthenticated = false;
    mockUseAuth.isLoading = false;
  });

  it('shows sign in/up links when not authenticated', () => {
    render(<Header />);
    expect(screen.getByText('header.signIn')).toBeInTheDocument();
    expect(screen.getByText('header.signUp')).toBeInTheDocument();
  });

  it('shows loading spinners when loading', () => {
    mockUseAuth.isLoading = true;
    const { container } = render(<Header />);
    expect(container.querySelectorAll('button[disabled]').length).toBe(2);
  });

  it('shows history/sign out links when authenticated', () => {
    mockUseAuth.isAuthenticated = true;
    render(<Header />);
    expect(screen.getByText('header.history')).toBeInTheDocument();
    expect(screen.getByText('header.signOut')).toBeInTheDocument();
  });

  it('signs out and redirects when on history page', async () => {
    mockUseAuth.isAuthenticated = true;
    mockUseAuth.signOut.mockResolvedValue(null);
    pathname = '/history';
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByText('header.signOut'));
    expect(replace).toHaveBeenCalledWith('/');
  });

  it('does not redirect when signing out from a non-history page', async () => {
    mockUseAuth.isAuthenticated = true;
    mockUseAuth.signOut.mockResolvedValue(null);
    pathname = '/about';
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByText('header.signOut'));
    expect(replace).not.toHaveBeenCalled();
  });

  it('shows a toast when sign out fails', async () => {
    mockUseAuth.isAuthenticated = true;
    mockUseAuth.signOut.mockResolvedValue('failed');
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByText('header.signOut'));
    expect(toast.error).toHaveBeenCalledWith('failed');
    expect(replace).not.toHaveBeenCalled();
  });
});
