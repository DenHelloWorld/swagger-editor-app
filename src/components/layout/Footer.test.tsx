import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renders links and copyright', () => {
    render(<Footer />);
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('RS School')).toBeInTheDocument();
    expect(screen.getByText('© 2026 Swagger Editor')).toBeInTheDocument();
  });
});
