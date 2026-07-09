import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

import { Toaster } from './sonner';

describe('Toaster', () => {
  it('renders without crashing', () => {
    const { container } = render(<Toaster />);
    expect(container).toBeTruthy();
  });

  it('renders with a section landmark for toasts', () => {
    const { container } = render(<Toaster />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });
});
