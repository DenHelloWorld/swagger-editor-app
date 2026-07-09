import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const replace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
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

const toastSuccess = vi.fn();
const toastError = vi.fn();
vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccess(...args),
    error: (...args: unknown[]) => toastError(...args),
  },
}));

const mockUseAuth = {
  isAuthenticated: false,
  signUp: vi.fn(),
  isLoading: false,
  signIn: vi.fn(),
  sessionError: null as string | null,
  clearSessionError: vi.fn(),
};
vi.mock('../useAuth', () => ({
  useAuth: () => mockUseAuth,
}));

import AuthForm from './AuthForm';

describe('AuthForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.isAuthenticated = false;
    mockUseAuth.isLoading = false;
    mockUseAuth.sessionError = null;
  });

  it('shows a spinner while loading', () => {
    mockUseAuth.isLoading = true;
    const { container } = render(<AuthForm type="Sign In" />);
    expect(container.querySelector('.size-8')).toBeInTheDocument();
  });

  it('renders nothing when already authenticated', () => {
    mockUseAuth.isAuthenticated = true;
    const { container } = render(<AuthForm type="Sign In" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the sign in form', () => {
    render(<AuthForm type="Sign In" />);
    expect(screen.getByText('Sign In Form')).toBeInTheDocument();
    expect(screen.queryByLabelText('Confirm Password')).not.toBeInTheDocument();
  });

  it('renders the sign up form with confirm password field', () => {
    render(<AuthForm type="Sign Up" />);
    expect(screen.getByText('Sign Up Form')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
  });

  it('submits valid sign in credentials', async () => {
    mockUseAuth.signIn.mockResolvedValue(null);
    const user = userEvent.setup();
    render(<AuthForm type="Sign In" />);

    await user.type(screen.getByLabelText('Your email'), 'a@b.com');
    await user.type(screen.getByLabelText('Password'), 'password1');
    const submit = screen.getByRole('button', { name: /submit/i });
    await waitFor(() => expect(submit).toBeEnabled());
    await user.click(submit);

    await waitFor(() =>
      expect(mockUseAuth.signIn).toHaveBeenCalledWith('a@b.com', 'password1'),
    );
  });

  it('shows a toast error when sign in fails', async () => {
    mockUseAuth.signIn.mockResolvedValue('Incorrect password.');
    const user = userEvent.setup();
    render(<AuthForm type="Sign In" />);

    await user.type(screen.getByLabelText('Your email'), 'a@b.com');
    await user.type(screen.getByLabelText('Password'), 'password1');
    const submit = screen.getByRole('button', { name: /submit/i });
    await waitFor(() => expect(submit).toBeEnabled());
    await user.click(submit);

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith('Incorrect password.', {
        position: 'top-center',
      }),
    );
  });

  it('shows a session error toast and clears it', () => {
    mockUseAuth.sessionError = 'session expired';
    render(<AuthForm type="Sign In" />);
    expect(toastError).toHaveBeenCalledWith('session expired', {
      position: 'top-center',
    });
    expect(mockUseAuth.clearSessionError).toHaveBeenCalled();
  });

  it('redirects and shows success toast when authenticated', () => {
    mockUseAuth.isAuthenticated = true;
    render(<AuthForm type="Sign In" />);
    expect(toastSuccess).toHaveBeenCalledWith('Welcome back');
    expect(replace).toHaveBeenCalledWith('/');
  });
});
