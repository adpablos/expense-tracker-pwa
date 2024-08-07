import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components';

import { Expense } from '../../types';
import { formatAmount } from '../../utils/expenseUtils';
// eslint-disable-next-line import/no-named-as-default
import Button from '../common/Button';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: ${({ theme }) => theme.space.medium};
`;

const TableHeader = styled.th`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.space.small};
  text-align: left;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${({ theme }) => theme.colors.backgroundLight};
  }
`;

const TableCell = styled.td`
  padding: ${({ theme }) => theme.space.small};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.xsmall};
`;

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(
      date.getDate()
    ).padStart(2, '0')}`;
  };

  return (
    <Table>
      <thead>
        <tr>
          <TableHeader>Fecha</TableHeader>
          <TableHeader>Descripción</TableHeader>
          <TableHeader>Cantidad</TableHeader>
          <TableHeader>Categoría</TableHeader>
          <TableHeader>Subcategoría</TableHeader>
          <TableHeader>Acciones</TableHeader>
        </tr>
      </thead>
      <tbody>
        {expenses.map((expense: Expense) => (
          <TableRow key={expense.id}>
            <TableCell>{formatDate(expense.date)}</TableCell>
            <TableCell>{expense.description}</TableCell>
            <TableCell>{formatAmount(expense.amount)}€</TableCell>
            <TableCell>{expense.category}</TableCell>
            <TableCell>{expense.subcategory}</TableCell>
            <TableCell>
              <ButtonContainer>
                <Button
                  variant="primary"
                  onClick={() => onEdit(expense)}
                  isRound
                  size="small"
                  aria-label="Editar gasto"
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="danger"
                  onClick={() => onDelete(expense)}
                  isRound
                  size="small"
                  aria-label="Eliminar gasto"
                >
                  <FaTrash />
                </Button>
              </ButtonContainer>
            </TableCell>
          </TableRow>
        ))}
      </tbody>
    </Table>
  );
};

export default ExpenseTable;
