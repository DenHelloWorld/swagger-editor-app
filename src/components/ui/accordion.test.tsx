import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './accordion';

function setup() {
  return render(
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Trigger 1</AccordionTrigger>
        <AccordionContent>Content 1</AccordionContent>
      </AccordionItem>
    </Accordion>,
  );
}

describe('Accordion', () => {
  it('renders trigger and hides content by default', () => {
    setup();
    expect(
      screen.getByRole('button', { name: 'Trigger 1' }),
    ).toBeInTheDocument();
  });

  it('expands and collapses content on trigger click', async () => {
    const user = userEvent.setup();
    setup();
    const trigger = screen.getByRole('button', { name: 'Trigger 1' });

    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Content 1')).toBeInTheDocument();

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('applies custom className to item', () => {
    const { container } = render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1" className="custom-item">
          <AccordionTrigger>T</AccordionTrigger>
          <AccordionContent>C</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(container.querySelector('.custom-item')).toBeInTheDocument();
  });
});
