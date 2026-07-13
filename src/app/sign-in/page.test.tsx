import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SignIn from './page';

vi.mock('@/features/auth/components/AuthForm', () => ({
  default: ({ type }: { type: string }) => <div>AuthForm: {type}</div>,
}));

describe('SignIn page', () => {
  it('renders AuthForm with Sign In type', () => {
    render(<SignIn />);
    expect(screen.getByText('AuthForm: Sign In')).toBeInTheDocument();
  });
});
