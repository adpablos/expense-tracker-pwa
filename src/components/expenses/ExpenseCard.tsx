/* eslint-disable import/no-named-as-default */
import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import styled from 'styled-components';

import { FlexContainer, Margin } from '../../styles/utilities';
import { Expense } from '../../types';
import { formatDateForDisplay } from '../../utils/dateUtils';
import { formatAmount } from '../../utils/expenseUtils';
import Button from '../common/Button';

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
  padding: ${({ theme }) => theme.padding.medium};
  margin-bottom: ${({ theme }) => theme.space.medium};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.padding.small};
  }
`;

const CardHeader = styled(FlexContainer)`
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space.small};
`;

const ExpenseDate = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.small};
`;

const Amount = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.medium};
`;

const Description = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  margin-bottom: ${({ theme }) => theme.space.small};
`;

const Category = styled.span`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.background};
  padding: 2px 6px;
  border-radius: 12px;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  margin-right: ${({ theme }) => theme.space.xsmall};
`;

const ActionButton = styled(Button)`
  padding: ${({ theme }) => theme.space.xsmall};
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
        <ExpenseDate>{formatDateForDisplay(expense.date)}</ExpenseDate>
        <Amount>${formatAmount(expense.amount)}</Amount>
      </CardHeader>
      <Description>{expense.description}</Description>
      <FlexContainer justify="space-between" align="center">
        <div>
          <Category>{expense.category}</Category>
          {expense.subcategory && <Category>{expense.subcategory}</Category>}
        </div>
        <FlexContainer>
          <ActionButton variant="primary" onClick={() => onEdit(expense)} isRound size="small">
            <FaEdit />
          </ActionButton>
          <Margin size="xsmall" direction="left">
            <ActionButton variant="danger" onClick={() => onDelete(expense)} isRound size="small">
              <FaTrash />
            </ActionButton>
          </Margin>
        </FlexContainer>
      </FlexContainer>
    </Card>
  );
};

export default ExpenseCard;
