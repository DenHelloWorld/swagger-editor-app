import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './page';

vi.mock('@/features/swagger-editor/components/SplitView/SplitView', () => ({
  SplitView: ({
    left,
    right,
  }: {
    left: React.ReactNode;
    right: React.ReactNode;
  }) => (
    <div>
      <div>{left}</div>
      <div>{right}</div>
    </div>
  ),
}));
vi.mock('@/features/swagger-editor/SwaggerEditor', () => ({
  SwaggerEditor: () => <div>SwaggerEditor</div>,
}));
vi.mock('@/features/swagger-viewer/SwaggerViewer', () => ({
  SwaggerViewer: () => <div>SwaggerViewer</div>,
}));

describe('Home page', () => {
  it('renders SplitView with editor and viewer', () => {
    render(<Home />);
    expect(screen.getByText('SwaggerEditor')).toBeInTheDocument();
    expect(screen.getByText('SwaggerViewer')).toBeInTheDocument();
  });
});
