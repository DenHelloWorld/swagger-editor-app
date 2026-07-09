import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SplitView } from './SplitView';

function setWindowSize(width: number, height: number) {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    value: height,
  });
}

describe('SplitView', () => {
  afterEach(() => {
    setWindowSize(1024, 768);
  });

  it('renders left and right content', () => {
    setWindowSize(1024, 768);
    render(<SplitView left={<div>Left</div>} right={<div>Right</div>} />);
    expect(screen.getByText('Left')).toBeInTheDocument();
    expect(screen.getByText('Right')).toBeInTheDocument();
  });

  it('updates layout on resize to vertical when height exceeds width', () => {
    setWindowSize(1024, 768);
    const { container } = render(
      <SplitView left={<div>Left</div>} right={<div>Right</div>} />,
    );
    expect(container.firstChild).toHaveStyle({ flexDirection: 'row' });

    setWindowSize(400, 900);
    fireEvent(window, new Event('resize'));

    expect(container.firstChild).toHaveStyle({ flexDirection: 'column' });
  });
});
