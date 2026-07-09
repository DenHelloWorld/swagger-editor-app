import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResponsesSection } from './ResponsesSection';
import type { ProcessedResponse } from '@/types/openapi';

describe('ResponsesSection', () => {
  it('renders responses with content type, description, properties, example', () => {
    const responses: ProcessedResponse[] = [
      {
        statusCode: '200',
        description: 'OK',
        contentType: 'application/json',
        isArray: true,
        properties: [{ name: 'id', type: 'string', required: false }],
        example: { id: 'x' },
      },
      {
        statusCode: '404',
        isArray: false,
        properties: [],
      },
    ];
    render(<ResponsesSection responses={responses} />);
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('OK')).toBeInTheDocument();
    expect(screen.getByText(/application\/json/)).toBeInTheDocument();
  });

  it('renders response without contentType but with isArray', () => {
    const responses: ProcessedResponse[] = [
      { statusCode: '204', isArray: true, properties: [] },
    ];
    render(<ResponsesSection responses={responses} />);
    expect(screen.getByText('array')).toBeInTheDocument();
  });

  it('renders response without contentType and without isArray', () => {
    const responses: ProcessedResponse[] = [
      { statusCode: '500', isArray: false, properties: [] },
    ];
    render(<ResponsesSection responses={responses} />);
    expect(screen.getByText('500')).toBeInTheDocument();
  });
});
