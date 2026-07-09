import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
} from './avatar';

describe('Avatar', () => {
  it('renders fallback content', () => {
    render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByText('AB')).toBeInTheDocument();
  });

  it('applies default size attribute', () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    );
    expect(container.querySelector('[data-slot="avatar"]')).toHaveAttribute(
      'data-size',
      'default',
    );
  });

  it('applies sm and lg size attributes', () => {
    const { container: smContainer } = render(
      <Avatar size="sm">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>,
    );
    expect(smContainer.querySelector('[data-slot="avatar"]')).toHaveAttribute(
      'data-size',
      'sm',
    );

    const { container: lgContainer } = render(
      <Avatar size="lg">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>,
    );
    expect(lgContainer.querySelector('[data-slot="avatar"]')).toHaveAttribute(
      'data-size',
      'lg',
    );
  });

  it('renders AvatarGroup with AvatarGroupCount and AvatarBadge', () => {
    render(
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>A1</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
        <AvatarBadge data-testid="badge">*</AvatarBadge>
      </AvatarGroup>,
    );
    expect(screen.getByText('+3')).toBeInTheDocument();
    expect(screen.getByTestId('badge')).toBeInTheDocument();
  });
});
