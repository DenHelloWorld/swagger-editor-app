import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MethodBadge } from './MethodBadge';

describe('MethodBadge', () => {
  it('renders uppercased method', () => {
    render(<MethodBadge method="get" />);
    expect(screen.getByText('GET')).toBeInTheDocument();
  });

  it('renders unknown method with default modifier', () => {
    render(<MethodBadge method="TRACE" />);
    expect(screen.getByText('TRACE')).toBeInTheDocument();
  });
});
