import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LocalTimestamp } from './LocalTimestamp';

describe('LocalTimestamp', () => {
  it('renders the timestamp formatted for the current environment', async () => {
    const value = '2026-07-05T00:00:00.000Z';
    render(<LocalTimestamp value={value} />);

    const expected = new Date(value).toLocaleString();
    expect(await screen.findByText(expected)).toBeInTheDocument();
  });
});
