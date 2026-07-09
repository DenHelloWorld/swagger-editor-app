import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SwaggerEditor } from './SwaggerEditor';
import { useSchemaSync } from './hooks/useSchemaSync';
import { useSchemaRestore } from './hooks/useSchemaRestore';

vi.mock('./hooks/useSchemaSync', () => ({ useSchemaSync: vi.fn() }));
vi.mock('./hooks/useSchemaRestore', () => ({ useSchemaRestore: vi.fn() }));
vi.mock('./components/SchemaEditor/SchemaEditor', () => ({
  SchemaEditor: ({ isRestoring }: { isRestoring: boolean }) => (
    <div>SchemaEditor isRestoring={String(isRestoring)}</div>
  ),
}));

describe('SwaggerEditor', () => {
  it('calls sync hook and passes restoring state through', () => {
    vi.mocked(useSchemaRestore).mockReturnValue({ isRestoring: true });
    render(<SwaggerEditor />);
    expect(useSchemaSync).toHaveBeenCalled();
    expect(
      screen.getByText('SchemaEditor isRestoring=true'),
    ).toBeInTheDocument();
  });
});
