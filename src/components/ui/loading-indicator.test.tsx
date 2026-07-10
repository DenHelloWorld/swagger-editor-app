import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingIndicator } from './loading-indicator';

describe('LoadingIndicator', () => {
  it('renders default text and a small spinner', () => {
    render(<LoadingIndicator />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    const spinner = screen.getByRole('status', { name: 'Loading' });
    expect(spinner).toHaveClass('size-5');
  });

  it('renders custom text', () => {
    render(<LoadingIndicator text="Restoring schema..." />);
    expect(screen.getByText('Restoring schema...')).toBeInTheDocument();
  });

  it('hides the text when text is an empty string', () => {
    render(<LoadingIndicator text="" />);
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
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
