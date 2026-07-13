import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SignUp from './page';

vi.mock('@/features/auth/components/AuthForm', () => ({
  default: ({ type }: { type: string }) => <div>AuthForm: {type}</div>,
}));

describe('SignUp page', () => {
  it('renders AuthForm with Sign Up type', () => {
    render(<SignUp />);
    expect(screen.getByText('AuthForm: Sign Up')).toBeInTheDocument();
  });
});
