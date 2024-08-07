import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components';

import { theme } from '../../styles/theme';
import { Expense } from '../../types';
import { formatAmount } from '../../utils/expenseUtils';

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${theme.colors.backgroundLight};
  }
`;

const TableCell = styled.td`
  padding: ${theme.padding.small};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-right: ${theme.padding.small};
  transition: color 0.3s;

  &:hover {
    opacity: 0.8;
  }
`;

const EditButton = styled(ActionButton)`
  color: ${theme.colors.primary};
`;

const DeleteButton = styled(ActionButton)`
  color: ${theme.colors.error};
`;

interface ExpenseItemProps {
  expense: Expense;
  onDelete: (expense: Expense) => void;
  onEdit: (expense: Expense) => void;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, onDelete, onEdit }) => {
  return (
    <TableRow>
      <TableCell>
        {new Date(expense.date).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })}
      </TableCell>
      <TableCell>{expense.description}</TableCell>
      <TableCell>{formatAmount(expense.amount)}€</TableCell>
      <TableCell>{expense.category}</TableCell>
      <TableCell>{expense.subcategory}</TableCell>
      <TableCell>
        <EditButton onClick={() => onEdit(expense)} aria-label="Editar gasto">
          <FaEdit />
        </EditButton>
        <DeleteButton onClick={() => onDelete(expense)} aria-label="Eliminar gasto">
          <FaTrash />
        </DeleteButton>
      </TableCell>
    </TableRow>
  );
};

export default ExpenseItem;
