import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingIndicator } from './loading-indicator';

describe('LoadingIndicator', () => {
  it('renders a small spinner by default', () => {
    render(<LoadingIndicator />);
    const spinner = screen.getByRole('status', { name: 'Loading' });
    expect(spinner).toHaveClass('size-5');
  });

  it('renders a large spinner when size is lg', () => {
    render(<LoadingIndicator size="lg" />);
    const spinner = screen.getByRole('status', { name: 'Loading' });
    expect(spinner).toHaveClass('size-8');
  });

  it('applies custom className to the wrapper', () => {
    render(<LoadingIndicator className="py-24" />);
    const spinner = screen.getByRole('status', { name: 'Loading' });
    expect(spinner.parentElement).toHaveClass('py-24');
  });
});
