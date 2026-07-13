import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormatToggle } from './FormatToggle';
import { useSchemaStore } from '@/store/schemaStore';
import { convertFormat } from '../../utils/convertFormat';

vi.mock('../../utils/convertFormat', () => ({ convertFormat: vi.fn() }));

const initialState = useSchemaStore.getState();

describe('FormatToggle', () => {
  beforeEach(() => {
    useSchemaStore.setState(initialState, true);
    vi.clearAllMocks();
  });

  it('shows YAML label when format is json and toggles to yaml', () => {
    useSchemaStore.setState({ format: 'json', raw: '{}' });
    vi.mocked(convertFormat).mockReturnValue('converted-yaml');

    render(<FormatToggle />);
    expect(screen.getByText('YAML')).toBeInTheDocument();
    fireEvent.click(screen.getByText('YAML'));

    expect(useSchemaStore.getState().format).toBe('yaml');
    expect(useSchemaStore.getState().raw).toBe('converted-yaml');
  });

  it('shows JSON label when format is yaml', () => {
    useSchemaStore.setState({ format: 'yaml' });
    render(<FormatToggle />);
    expect(screen.getByText('JSON')).toBeInTheDocument();
  });

  it('toggles from yaml to json successfully', () => {
    useSchemaStore.setState({ format: 'yaml', raw: 'a: 1' });
    vi.mocked(convertFormat).mockReturnValue('{"a":1}');
    render(<FormatToggle />);
    fireEvent.click(screen.getByText('JSON'));
    expect(useSchemaStore.getState().format).toBe('json');
    expect(useSchemaStore.getState().raw).toBe('{"a":1}');
  });

  it('falls back to just switching format when conversion throws', () => {
    useSchemaStore.setState({ format: 'json', raw: 'invalid' });
    vi.mocked(convertFormat).mockImplementation(() => {
      throw new Error('bad');
    });

    render(<FormatToggle />);
    fireEvent.click(screen.getByText('YAML'));

    expect(useSchemaStore.getState().format).toBe('yaml');
  });
});
