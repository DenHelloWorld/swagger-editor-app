import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Label } from './label';
import { Input } from './input';

describe('Label', () => {
  it('renders label text', () => {
    render(<Label htmlFor="name">Name</Label>);
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('associates with a form control via htmlFor', () => {
    render(
      <>
        <Label htmlFor="name">Name</Label>
        <Input id="name" />
      </>,
    );
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Label htmlFor="x" className="custom-label">
        X
      </Label>,
    );
    expect(screen.getByText('X')).toHaveClass('custom-label');
  });
});
