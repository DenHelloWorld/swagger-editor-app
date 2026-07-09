import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TechCard } from './TechCard';

describe('TechCard', () => {
  it('renders name and links to url', () => {
    render(
      <TechCard
        name="React"
        url="https://react.dev"
        iconId="react"
        color="#61dafb"
      />,
    );
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      'https://react.dev',
    );
  });
});
