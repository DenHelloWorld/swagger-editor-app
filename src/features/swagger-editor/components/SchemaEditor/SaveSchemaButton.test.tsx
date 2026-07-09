import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SaveSchemaButton } from './SaveSchemaButton';
import { useSchemaSave } from '../../hooks/useSchemaSave';
import { toast } from 'sonner';

vi.mock('../../hooks/useSchemaSave');
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

describe('SaveSchemaButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when not authenticated', () => {
    vi.mocked(useSchemaSave).mockReturnValue({
      isAuthenticated: false,
      isValid: true,
      status: 'idle',
      error: null,
      save: vi.fn(),
    });
    const { container } = render(<SaveSchemaButton />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows Save label and is disabled when invalid', () => {
    vi.mocked(useSchemaSave).mockReturnValue({
      isAuthenticated: true,
      isValid: false,
      status: 'idle',
      error: null,
      save: vi.fn(),
    });
    render(<SaveSchemaButton />);
    expect(screen.getByText('Save')).toBeDisabled();
  });

  it('shows Saving... label while saving', () => {
    vi.mocked(useSchemaSave).mockReturnValue({
      isAuthenticated: true,
      isValid: true,
      status: 'saving',
      error: null,
      save: vi.fn(),
    });
    render(<SaveSchemaButton />);
    expect(screen.getByText('Saving...')).toBeInTheDocument();
  });

  it('shows success toast on success status', () => {
    vi.mocked(useSchemaSave).mockReturnValue({
      isAuthenticated: true,
      isValid: true,
      status: 'success',
      error: null,
      save: vi.fn(),
    });
    render(<SaveSchemaButton />);
    expect(toast.success).toHaveBeenCalledWith('Saved');
  });

  it('shows error toast on error status', () => {
    vi.mocked(useSchemaSave).mockReturnValue({
      isAuthenticated: true,
      isValid: true,
      status: 'error',
      error: 'oops',
      save: vi.fn(),
    });
    render(<SaveSchemaButton />);
    expect(toast.error).toHaveBeenCalledWith('oops');
  });
});
