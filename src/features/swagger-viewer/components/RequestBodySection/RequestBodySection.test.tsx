import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RequestBodySection } from './RequestBodySection';
import type { ProcessedRequestBody } from '@/types/openapi';

describe('RequestBodySection', () => {
  it('renders content type, required flag, array, properties and example', () => {
    const requestBody: ProcessedRequestBody = {
      contentType: 'application/json',
      required: true,
      isArray: true,
      properties: [{ name: 'id', type: 'string', required: true }],
      example: { id: 'x' },
    };
    render(<RequestBodySection requestBody={requestBody} />);
    expect(screen.getByText('viewer.requestBody.title')).toBeInTheDocument();
    expect(screen.getByText(/application\/json/)).toBeInTheDocument();
    expect(screen.getAllByText('viewer.table.required').length).toBeGreaterThan(
      0,
    );
    expect(screen.getByText('viewer.example.title')).toBeInTheDocument();
  });

  it('renders without content type but with array flag', () => {
    const requestBody: ProcessedRequestBody = {
      isArray: true,
      properties: [],
    };
    render(<RequestBodySection requestBody={requestBody} />);
    expect(screen.getByText('array')).toBeInTheDocument();
  });

  it('renders without content type and without array', () => {
    const requestBody: ProcessedRequestBody = {
      isArray: false,
      properties: [],
    };
    render(<RequestBodySection requestBody={requestBody} />);
    expect(screen.getByText('viewer.requestBody.title')).toBeInTheDocument();
    expect(screen.queryByText('array')).not.toBeInTheDocument();
    expect(screen.queryByText('viewer.example.title')).not.toBeInTheDocument();
  });
});
