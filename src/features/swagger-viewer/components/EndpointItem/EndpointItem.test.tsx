import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Accordion } from '@/components/ui/accordion';
import { EndpointItem } from './EndpointItem';
import type { ProcessedEndpoint } from '@/types/openapi';

function renderItem(endpoint: ProcessedEndpoint) {
  return render(
    <Accordion type="multiple">
      <EndpointItem endpoint={endpoint} />
    </Accordion>,
  );
}

describe('EndpointItem', () => {
  it('renders method, summary, description, parameters, requestBody, responses', async () => {
    const endpoint: ProcessedEndpoint = {
      method: 'post',
      path: '/pet',
      summary: 'Create pet',
      description: 'Creates a pet',
      parameters: [
        {
          name: 'id',
          in: 'query',
          required: false,
        } as ProcessedEndpoint['parameters'][number],
      ],
      requestBody: {
        isArray: false,
        properties: [],
      },
      responses: [
        {
          statusCode: '200',
          isArray: false,
          properties: [],
        },
      ],
    };
    renderItem(endpoint);
    expect(screen.getByText('POST')).toBeInTheDocument();
    expect(screen.getByText('Create pet')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Create pet'));
    expect(await screen.findByText('Creates a pet')).toBeInTheDocument();
    expect(screen.getByText('Try it out')).toBeInTheDocument();
  });

  it('renders without summary, description, parameters, requestBody, responses', () => {
    const endpoint: ProcessedEndpoint = {
      method: 'get',
      path: '/health',
      parameters: [],
      requestBody: null,
      responses: [],
    };
    renderItem(endpoint);
    expect(screen.getByText('GET')).toBeInTheDocument();
  });
});
