import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
} from './field';

describe('Field', () => {
  it('renders Field with default vertical orientation', () => {
    render(<Field data-testid="field">content</Field>);
    const field = screen.getByTestId('field');
    expect(field).toHaveAttribute('data-orientation', 'vertical');
    expect(field).toHaveAttribute('role', 'group');
  });

  it('renders horizontal and responsive orientations', () => {
    const { rerender } = render(
      <Field orientation="horizontal" data-testid="field">
        content
      </Field>,
    );
    expect(screen.getByTestId('field')).toHaveAttribute(
      'data-orientation',
      'horizontal',
    );

    rerender(
      <Field orientation="responsive" data-testid="field">
        content
      </Field>,
    );
    expect(screen.getByTestId('field')).toHaveAttribute(
      'data-orientation',
      'responsive',
    );
  });

  it('renders FieldSet, FieldLegend, FieldGroup, FieldContent, FieldTitle', () => {
    render(
      <FieldSet>
        <FieldLegend>Legend</FieldLegend>
        <FieldGroup>
          <FieldContent>
            <FieldTitle>Title</FieldTitle>
          </FieldContent>
        </FieldGroup>
      </FieldSet>,
    );
    expect(screen.getByText('Legend')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  it('renders FieldLegend with label variant', () => {
    render(<FieldLegend variant="label">Label variant</FieldLegend>);
    expect(screen.getByText('Label variant')).toHaveAttribute(
      'data-variant',
      'label',
    );
  });

  it('renders FieldLabel wrapping a Label', () => {
    render(<FieldLabel htmlFor="x">My Label</FieldLabel>);
    expect(screen.getByText('My Label')).toBeInTheDocument();
  });

  it('renders FieldDescription text', () => {
    render(<FieldDescription>Helper text</FieldDescription>);
    expect(screen.getByText('Helper text')).toBeInTheDocument();
  });

  it('renders FieldSeparator with and without children', () => {
    const { rerender, container } = render(<FieldSeparator />);
    expect(
      container.querySelector('[data-content="false"]'),
    ).toBeInTheDocument();

    rerender(<FieldSeparator>OR</FieldSeparator>);
    expect(screen.getByText('OR')).toBeInTheDocument();
    expect(
      container.querySelector('[data-content="true"]'),
    ).toBeInTheDocument();
  });

  describe('FieldError', () => {
    it('renders children when provided', () => {
      render(<FieldError>Custom error</FieldError>);
      expect(screen.getByRole('alert')).toHaveTextContent('Custom error');
    });

    it('renders nothing when no errors or children', () => {
      const { container } = render(<FieldError />);
      expect(container).toBeEmptyDOMElement();
    });

    it('renders a single error message', () => {
      render(<FieldError errors={[{ message: 'Required' }]} />);
      expect(screen.getByRole('alert')).toHaveTextContent('Required');
    });

    it('renders a list for multiple unique error messages', () => {
      render(
        <FieldError
          errors={[{ message: 'Required' }, { message: 'Too short' }]}
        />,
      );
      const alert = screen.getByRole('alert');
      expect(alert.querySelectorAll('li')).toHaveLength(2);
      expect(alert).toHaveTextContent('Required');
      expect(alert).toHaveTextContent('Too short');
    });

    it('dedupes identical error messages', () => {
      render(
        <FieldError
          errors={[{ message: 'Required' }, { message: 'Required' }]}
        />,
      );
      expect(screen.getByRole('alert')).toHaveTextContent('Required');
    });
  });
});
