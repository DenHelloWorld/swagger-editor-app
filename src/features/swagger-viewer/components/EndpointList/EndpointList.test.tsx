import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EndpointList } from './EndpointList';
import type { ProcessedSpec } from '@/types/openapi';

describe('EndpointList', () => {
  it('renders empty state when spec is null', () => {
    render(<EndpointList spec={null} />);
    expect(screen.getByText('viewer.emptyState.title')).toBeInTheDocument();
  });

  it('renders groups when spec is provided', () => {
    const spec: ProcessedSpec = {
      version: 'v3',
      groups: [
        {
          path: '/pet',
          endpoints: [
            {
              method: 'get',
              path: '/pet',
              parameters: [],
              requestBody: null,
              responses: [],
            },
          ],
        },
      ],
    };
    render(<EndpointList spec={spec} />);
    expect(screen.getByText('/pet')).toBeInTheDocument();
  });
});
