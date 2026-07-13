import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorPage from './error';

describe('Error page', () => {
  it('renders error message and calls reset on click', () => {
    const reset = vi.fn();
    render(<ErrorPage error={new Error('boom')} reset={reset} />);
    expect(screen.getByText('errorPage.title')).toBeInTheDocument();
    fireEvent.click(screen.getByText('errorPage.retry'));
    expect(reset).toHaveBeenCalled();
  });
});
