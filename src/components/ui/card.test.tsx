import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from './card';

describe('Card', () => {
  it('renders all subcomponents with content', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('applies default size attribute', () => {
    const { container } = render(<Card>Body</Card>);
    expect(container.querySelector('[data-slot="card"]')).toHaveAttribute(
      'data-size',
      'default',
    );
  });

  it('applies sm size attribute', () => {
    const { container } = render(<Card size="sm">Body</Card>);
    expect(container.querySelector('[data-slot="card"]')).toHaveAttribute(
      'data-size',
      'sm',
    );
  });
});
