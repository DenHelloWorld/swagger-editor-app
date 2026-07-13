import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HistoryLoading from './HistoryLoading';

describe('HistoryLoading', () => {
  it('shows a loading indicator', () => {
    render(<HistoryLoading />);
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });
});
