import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SwaggerViewer } from './SwaggerViewer';
import { useSchemaStore } from '@/store/schemaStore';

vi.mock('@/store/schemaStore', () => ({
  useSchemaStore: vi.fn(),
}));

describe('SwaggerViewer', () => {
  it('renders empty state when no spec in store', () => {
    vi.mocked(useSchemaStore).mockImplementation((selector) =>
      selector({ processedSpec: null } as never),
    );
    render(<SwaggerViewer />);
    expect(screen.getByText('viewer.emptyState.title')).toBeInTheDocument();
  });

  it('renders groups when spec is present', () => {
    vi.mocked(useSchemaStore).mockImplementation((selector) =>
      selector({
        processedSpec: {
          version: 'v3',
          groups: [
            {
              path: '/pet',
              endpoints: [],
            },
          ],
        },
      } as never),
    );
    render(<SwaggerViewer />);
    expect(screen.getByText('/pet')).toBeInTheDocument();
  });
});
