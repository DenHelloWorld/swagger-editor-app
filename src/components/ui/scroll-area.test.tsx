import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScrollArea, ScrollBar } from './scroll-area';

describe('ScrollArea', () => {
  it('renders children inside viewport', () => {
    render(
      <ScrollArea>
        <div>Scrollable content</div>
      </ScrollArea>,
    );
    expect(screen.getByText('Scrollable content')).toBeInTheDocument();
  });

  it('renders with default vertical ScrollBar orientation', () => {
    const { container } = render(
      <ScrollArea type="always">
        <div>content</div>
      </ScrollArea>,
    );
    expect(
      container.querySelector('[data-slot="scroll-area-scrollbar"]'),
    ).toHaveAttribute('data-orientation', 'vertical');
  });

  it('renders horizontal ScrollBar when specified', () => {
    const { container } = render(
      <ScrollArea type="always">
        <div>content</div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>,
    );
    const scrollbars = container.querySelectorAll(
      '[data-slot="scroll-area-scrollbar"]',
    );
    const horizontal = Array.from(scrollbars).find(
      (el) => el.getAttribute('data-orientation') === 'horizontal',
    );
    expect(horizontal).toBeTruthy();
  });
});
