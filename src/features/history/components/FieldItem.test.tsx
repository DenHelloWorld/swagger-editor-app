import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FieldItem } from './FieldItem';

describe('FieldItem', () => {
  it('renders the label and value', () => {
    render(<FieldItem label="Duration" value="42 ms" />);
    expect(screen.getByText('Duration')).toBeInTheDocument();
    expect(screen.getByText('42 ms')).toBeInTheDocument();
  });

  it('applies monospace styling when mono is true', () => {
    render(<FieldItem label="URL" value="/pet/1" mono />);
    expect(screen.getByText('/pet/1')).toHaveClass('font-mono');
  });

  it('applies the default text size class when none is given', () => {
    render(<FieldItem label="Method" value="GET" />);
    expect(screen.getByText('GET')).toHaveClass('text-sm');
  });

  it('applies a custom valueClassName when given', () => {
    render(<FieldItem label="Error" value="boom" valueClassName="text-xs" />);
    expect(screen.getByText('boom')).toHaveClass('text-xs');
  });
});
