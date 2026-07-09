import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

const initAuth = vi.fn(() => vi.fn());
vi.mock('./authStore', () => ({
  useAuthStore: (selector: (s: { initAuth: typeof initAuth }) => unknown) =>
    selector({ initAuth }),
}));

import { AuthProvider } from './AuthProvider';

describe('AuthProvider', () => {
  it('calls initAuth on mount and renders children', () => {
    const { getByText, unmount } = render(
      <AuthProvider>
        <span>child</span>
      </AuthProvider>,
    );
    expect(getByText('child')).toBeInTheDocument();
    expect(initAuth).toHaveBeenCalled();
    unmount();
  });
});
