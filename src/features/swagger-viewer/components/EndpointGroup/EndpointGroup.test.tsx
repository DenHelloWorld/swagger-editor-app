import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EndpointGroup } from './EndpointGroup';
import type { ProcessedGroup } from '@/types/openapi';

describe('EndpointGroup', () => {
  it('renders group path and endpoints', () => {
    const group: ProcessedGroup = {
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
    };
    render(<EndpointGroup group={group} />);
    expect(screen.getByText('/pet')).toBeInTheDocument();
    expect(screen.getByText('GET')).toBeInTheDocument();
  });
});
