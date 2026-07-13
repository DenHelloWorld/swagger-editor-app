import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TryItOutSection } from './TryItOutSection';
import { useTryItOut } from '../../hooks/useTryItOut';
import type { ProcessedEndpoint } from '@/types/openapi';
import { toast } from 'sonner';

vi.mock('../../hooks/useTryItOut');
vi.mock('sonner', async () => {
  const { mockToast } = await import('@/test/mocks/sonner');
  return { toast: mockToast };
});

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
  const originalClipboard = navigator.clipboard;

  beforeEach(() => {
    vi.clearAllMocks();
    mockHook();
  });

  afterEach(() => {
    Object.assign(navigator, { clipboard: originalClipboard });
  });

  it('toggles open state to show form fields', () => {
    render(<TryItOutSection endpoint={endpoint} />);
    fireEvent.click(screen.getByText('viewer.tryItOut.open'));
    expect(screen.getByText('viewer.tryItOut.serverUrl')).toBeInTheDocument();
    expect(
      screen.getByText('viewer.tryItOut.pathParameters'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('viewer.tryItOut.queryParameters'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('viewer.tryItOut.headerParameters'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('viewer.tryItOut.cookieParameters'),
    ).toBeInTheDocument();
    expect(screen.getByText('viewer.tryItOut.requestBody')).toBeInTheDocument();

    fireEvent.click(screen.getByText('viewer.tryItOut.hide'));
    expect(
      screen.queryByText('viewer.tryItOut.serverUrl'),
    ).not.toBeInTheDocument();
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
    fireEvent.click(screen.getByText('viewer.tryItOut.open'));
    expect(screen.getByText('viewer.tryItOut.response')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(
      screen.getByText('viewer.tryItOut.responseHeaders'),
    ).toBeInTheDocument();
  });

  it('copies curl to clipboard on success', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    mockHook({ baseUrl: 'https://api.example.com' });
    render(<TryItOutSection endpoint={endpoint} />);
    fireEvent.click(screen.getByText('viewer.tryItOut.open'));
    fireEvent.click(screen.getByText('viewer.tryItOut.generateCurl'));
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
    fireEvent.click(screen.getByText('viewer.tryItOut.open'));
    fireEvent.click(screen.getByText('viewer.tryItOut.generateCurl'));
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
    fireEvent.click(screen.getByText('viewer.tryItOut.open'));
    expect(
      screen.queryByText('viewer.tryItOut.pathParameters'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('viewer.tryItOut.queryParameters'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('viewer.tryItOut.headerParameters'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('viewer.tryItOut.cookieParameters'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('viewer.tryItOut.requestBody'),
    ).not.toBeInTheDocument();
  });

  it('calls execute when Execute clicked', () => {
    const execute = vi.fn();
    mockHook({ baseUrl: 'https://api.example.com', execute });
    render(<TryItOutSection endpoint={endpoint} />);
    fireEvent.click(screen.getByText('viewer.tryItOut.open'));
    fireEvent.click(screen.getByText('viewer.tryItOut.execute'));
    expect(execute).toHaveBeenCalled();
  });
});
