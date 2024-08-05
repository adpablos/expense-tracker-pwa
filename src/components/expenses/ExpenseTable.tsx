import React from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Expense } from '../../types';
import { formatAmount } from '../../utils/expenseUtils';
import { theme } from '../../styles/theme';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: ${theme.padding.medium};
`;

const TableHeader = styled.th`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.background};
  padding: ${theme.padding.small};
  text-align: left;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${theme.colors.backgroundLight};
  }
`;

const TableCell = styled.td`
  padding: ${theme.padding.small};
  border-bottom: 1px solid ${theme.colors.border};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-right: ${theme.padding.small};
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.7;
  }
`;

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
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
              <ActionButton onClick={() => onEdit(expense)} aria-label="Editar gasto">
                <FaEdit color={theme.colors.primary} />
              </ActionButton>
              <ActionButton onClick={() => onDelete(expense)} aria-label="Eliminar gasto">
                <FaTrash color={theme.colors.error} />
              </ActionButton>
            </TableCell>
          </TableRow>
        ))}
      </tbody>
    </Table>
  );
};

export default ExpenseTable;