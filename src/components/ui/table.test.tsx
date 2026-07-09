import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './table';

describe('Table', () => {
  it('renders all subcomponents with correct semantic roles', () => {
    render(
      <Table>
        <TableCaption>My caption</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Header 1</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Cell 1</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Footer cell</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Header 1' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Cell 1' })).toBeInTheDocument();
    expect(screen.getByText('My caption')).toBeInTheDocument();
    expect(screen.getByText('Footer cell')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(3);
  });
});
