import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from './spinner';

describe('Spinner', () => {
  it('renders with status role and accessible label', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status', { name: 'Loading' });
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('data-slot', 'spinner');
  });

  it('applies custom className alongside defaults', () => {
    render(<Spinner className="text-red-500" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('animate-spin');
    expect(spinner).toHaveClass('text-red-500');
  });
});
