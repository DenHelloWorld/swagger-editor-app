import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SchemaTable } from './SchemaTable';
import type { ProcessedSchemaProperty } from '@/types/openapi';

describe('SchemaTable', () => {
  it('renders nothing for empty properties', () => {
    const { container } = render(<SchemaTable properties={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders properties with required, enum and description', () => {
    const properties: ProcessedSchemaProperty[] = [
      { name: 'id', type: 'integer', required: true },
      {
        name: 'status',
        type: 'string',
        enum: ['a', 'b'],
        description: 'desc',
        required: false,
      },
    ];
    render(<SchemaTable properties={properties} />);
    expect(screen.getByText('id')).toBeInTheDocument();
    expect(screen.getByText('viewer.table.required')).toBeInTheDocument();
    expect(screen.getByText('string (a | b)')).toBeInTheDocument();
    expect(screen.getByText('desc')).toBeInTheDocument();
  });
});
