import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DetailItem } from './DetailItem';

describe('DetailItem', () => {
  it('renders the label as a screen-reader-only dt and the value via FieldItem', () => {
    render(<DetailItem label="Status Code" value={200} />);
    expect(screen.getAllByText('Status Code')).toHaveLength(2);
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  it('forwards mono to the underlying FieldItem', () => {
    render(<DetailItem label="Endpoint" value="/pet/1" mono />);
    expect(screen.getByText('/pet/1')).toHaveClass('font-mono');
  });
});
