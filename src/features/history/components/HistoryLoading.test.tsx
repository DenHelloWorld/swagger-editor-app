import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HistoryLoading from './HistoryLoading';

describe('HistoryLoading', () => {
  it('shows a loading message', () => {
    render(<HistoryLoading />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
