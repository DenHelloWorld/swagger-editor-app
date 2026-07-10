import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExampleBlock } from './ExampleBlock';

describe('ExampleBlock', () => {
  it('renders formatted json example', () => {
    const { container } = render(<ExampleBlock example={{ a: 1 }} />);
    expect(screen.getByText('viewer.example.title')).toBeInTheDocument();
    expect(container.querySelector('pre')?.textContent).toBe(
      JSON.stringify({ a: 1 }, null, 2),
    );
  });
});
