import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TryItOutSection } from './TryItOutSection';
import { useTryItOut } from '../../hooks/useTryItOut';
import type { ProcessedEndpoint } from '@/types/openapi';
import { toast } from 'sonner';

vi.mock('../../hooks/useTryItOut');
vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

const endpoint: ProcessedEndpoint = {
  method: 'post',
  path: '/pet/{id}',
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
    } as ProcessedEndpoint['parameters'][number],
    {
      name: 'limit',
      in: 'query',
      required: false,
    } as ProcessedEndpoint['parameters'][number],
    {
      name: 'X-Token',
      in: 'header',
      required: false,
    } as ProcessedEndpoint['parameters'][number],
    {
      name: 'session',
      in: 'cookie',
      required: false,
    } as ProcessedEndpoint['parameters'][number],
  ],
  requestBody: { isArray: false, properties: [] },
  responses: [],
};

function mockHook(overrides = {}) {
  vi.mocked(useTryItOut).mockReturnValue({
    baseUrl: '',
    setBaseUrl: vi.fn(),
    paramValues: {},
    setParamValue: vi.fn(),
    bodyValue: '',
    setBodyValue: vi.fn(),
    response: null,
    isLoading: false,
    error: null,
    execute: vi.fn(),
    generateCurl: vi.fn(() => 'curl -X POST'),
    hasBody: true,
    ...overrides,
  });
}

describe('TryItOutSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHook();
  });

  it('toggles open state to show form fields', () => {
    render(<TryItOutSection endpoint={endpoint} />);
    fireEvent.click(screen.getByText('Try it out'));
    expect(screen.getByText('Server URL')).toBeInTheDocument();
    expect(screen.getByText('Path Parameters')).toBeInTheDocument();
    expect(screen.getByText('Query Parameters')).toBeInTheDocument();
    expect(screen.getByText('Header Parameters')).toBeInTheDocument();
    expect(screen.getByText('Cookie Parameters')).toBeInTheDocument();
    expect(screen.getByText('Request Body')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Hide'));
    expect(screen.queryByText('Server URL')).not.toBeInTheDocument();
  });

  it('shows error toast when error present', () => {
    mockHook({ error: 'Something broke' });
    render(<TryItOutSection endpoint={endpoint} />);
    expect(toast.error).toHaveBeenCalledWith(
      'Something broke',
      expect.objectContaining({ id: expect.any(String) }),
    );
  });

  it('renders response section when response present', () => {
    mockHook({
      response: { status: 200, headers: { a: 'b' }, body: '{}' },
    });
    render(<TryItOutSection endpoint={endpoint} />);
    fireEvent.click(screen.getByText('Try it out'));
    expect(screen.getByText('Response')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('Response headers')).toBeInTheDocument();
  });

  it('copies curl to clipboard on success', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    mockHook({ baseUrl: 'https://api.example.com' });
    render(<TryItOutSection endpoint={endpoint} />);
    fireEvent.click(screen.getByText('Try it out'));
    fireEvent.click(screen.getByText('Generate cURL'));
    await Promise.resolve();
    await Promise.resolve();
    expect(writeText).toHaveBeenCalledWith('curl -X POST');
  });

  it('shows error toast when generateCurl throws', async () => {
    mockHook({
      baseUrl: 'https://api.example.com',
      generateCurl: vi.fn(() => {
        throw new Error('bad url');
      }),
    });
    render(<TryItOutSection endpoint={endpoint} />);
    fireEvent.click(screen.getByText('Try it out'));
    fireEvent.click(screen.getByText('Generate cURL'));
    await Promise.resolve();
    expect(toast.error).toHaveBeenCalledWith('bad url');
  });

  it('renders without optional param sections and body when none apply', () => {
    mockHook({ hasBody: false });
    const minimalEndpoint: ProcessedEndpoint = {
      method: 'get',
      path: '/health',
      parameters: [],
      requestBody: null,
      responses: [],
    };
    render(<TryItOutSection endpoint={minimalEndpoint} />);
    fireEvent.click(screen.getByText('Try it out'));
    expect(screen.queryByText('Path Parameters')).not.toBeInTheDocument();
    expect(screen.queryByText('Query Parameters')).not.toBeInTheDocument();
    expect(screen.queryByText('Header Parameters')).not.toBeInTheDocument();
    expect(screen.queryByText('Cookie Parameters')).not.toBeInTheDocument();
    expect(screen.queryByText('Request Body')).not.toBeInTheDocument();
  });

  it('calls execute when Execute clicked', () => {
    const execute = vi.fn();
    mockHook({ baseUrl: 'https://api.example.com', execute });
    render(<TryItOutSection endpoint={endpoint} />);
    fireEvent.click(screen.getByText('Try it out'));
    fireEvent.click(screen.getByText('Execute'));
    expect(execute).toHaveBeenCalled();
  });
});
