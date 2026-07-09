import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loading from './loading';

describe('History loading', () => {
  it('shows the loading indicator', () => {
    render(<Loading />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
