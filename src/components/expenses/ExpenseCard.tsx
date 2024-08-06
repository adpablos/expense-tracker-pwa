// src/components/expenses/ExpenseCard.tsx
import React from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Expense } from '../../types';
import { formatAmount } from '../../utils/expenseUtils';
import { theme } from '../../styles/theme';
import { format } from 'date-fns';

const Card = styled.div`
  background-color: ${theme.colors.backgroundLight};
  border-radius: ${theme.borderRadius};
  padding: ${theme.padding.medium};
  margin-bottom: ${theme.padding.small};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.padding.small};
`;

const ExpenseDate = styled.span`
  font-weight: bold;
`;

const Amount = styled.span`
  color: ${theme.colors.primary};
  font-weight: bold;
`;

const Description = styled.p`
  margin: ${theme.padding.small} 0;
`;

const Category = styled.span`
  background-color: ${theme.colors.secondary};
  color: ${theme.colors.background};
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 0.8em;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-left: ${theme.padding.small};
  color: ${theme.colors.primary};
  
  &:last-child {
    color: ${theme.colors.error};
  }
`;

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onEdit, onDelete }) => {
  return (
    <Card>
      <CardHeader>
        <ExpenseDate>{format(new Date(expense.date), 'yyyy-MM-dd')}</ExpenseDate>
        <Amount>{formatAmount(expense.amount)}€</Amount>
      </CardHeader>
      <Description>{expense.description}</Description>
      <div>
        <Category>{expense.category}</Category>
        {expense.subcategory && <Category>{expense.subcategory}</Category>}
        <ActionButton onClick={() => onEdit(expense)}>
          <FaEdit />
        </ActionButton>
        <ActionButton onClick={() => onDelete(expense)}>
          <FaTrash />
        </ActionButton>
      </div>
    </Card>
  );
};

export default ExpenseCard;
