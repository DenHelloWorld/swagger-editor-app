import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SchemaEditor } from './SchemaEditor';
import { useSchemaStore } from '@/store/schemaStore';

vi.mock('next/dynamic', () => ({
  default: () => {
    function MockMonaco(props: {
      value?: string;
      onChange?: (v?: string) => void;
    }) {
      return (
        <textarea
          data-testid="monaco"
          value={props.value}
          onChange={(e) => props.onChange?.(e.target.value)}
        />
      );
    }
    return MockMonaco;
  },
}));

vi.mock(
  '@/features/swagger-editor/components/FormatToggle/FormatToggle',
  () => ({
    FormatToggle: () => <div>FormatToggle</div>,
  }),
);
vi.mock(
  '@/features/swagger-editor/components/SchemaEditor/SaveSchemaButton',
  () => ({
    SaveSchemaButton: () => <div>SaveSchemaButton</div>,
  }),
);

const initialState = useSchemaStore.getState();

describe('SchemaEditor', () => {
  beforeEach(() => {
    useSchemaStore.setState(initialState, true);
  });

  it('renders editor with raw value and toolbar', () => {
    useSchemaStore.setState({ raw: '{"a":1}', format: 'json', errors: [] });
    render(<SchemaEditor />);
    expect(screen.getByText('FormatToggle')).toBeInTheDocument();
    expect(screen.getByText('SaveSchemaButton')).toBeInTheDocument();
    expect(screen.getByTestId('monaco')).toHaveValue('{"a":1}');
  });

  it('shows restoring indicator when isRestoring is true', () => {
    render(<SchemaEditor isRestoring />);
    expect(screen.getByText('Loading your schema...')).toBeInTheDocument();
  });

  it('renders validation errors', () => {
    useSchemaStore.setState({ errors: ['Invalid schema'] });
    render(<SchemaEditor />);
    expect(screen.getByText('Invalid schema')).toBeInTheDocument();
  });

  it('updates raw on editor change', () => {
    useSchemaStore.setState({ raw: '' });
    render(<SchemaEditor />);
    const textarea = screen.getByTestId('monaco');
    textarea.dispatchEvent(new Event('change', { bubbles: true }));
    expect(textarea).toBeInTheDocument();
  });
});
