import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components';

import { Expense } from '../../types';
import { formatAmount } from '../../utils/expenseUtils';
// eslint-disable-next-line import/no-named-as-default
import Button from '../common/Button';

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${({ theme }) => theme.colors.backgroundLight};
  }
`;

const TableCell = styled.td`
  padding: ${({ theme }) => theme.space.small};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.xsmall};
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
        <ButtonContainer>
          <Button variant="primary" onClick={() => onEdit(expense)} isRound size="small">
            <FaEdit />
          </Button>
          <Button variant="danger" onClick={() => onDelete(expense)} isRound size="small">
            <FaTrash />
          </Button>
        </ButtonContainer>
      </TableCell>
    </TableRow>
  );
};

export default ExpenseItem;
