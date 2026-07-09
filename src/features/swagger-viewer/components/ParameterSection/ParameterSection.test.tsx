import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ParameterSection } from './ParameterSection';
import type { ResolvedParameter } from '@/types/openapi';

describe('ParameterSection', () => {
  it('renders parameters with name, type, in and description', () => {
    const parameters: ResolvedParameter[] = [
      {
        name: 'id',
        in: 'path',
        required: true,
        description: 'the id',
        schema: { type: 'string' },
      } as ResolvedParameter,
      {
        name: 'limit',
        in: 'query',
        required: false,
        schema: { type: 'integer' },
      } as ResolvedParameter,
    ];
    render(<ParameterSection parameters={parameters} />);
    expect(screen.getByText('id')).toBeInTheDocument();
    expect(screen.getByText('limit')).toBeInTheDocument();
    expect(screen.getByText('* required')).toBeInTheDocument();
    expect(screen.getByText('the id')).toBeInTheDocument();
  });
});
