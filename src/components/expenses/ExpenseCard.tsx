/* eslint-disable import/no-named-as-default */
import { format } from 'date-fns';
import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import styled from 'styled-components';

import { FlexContainer, Margin, Padding } from '../../styles/utilities';
import { Expense } from '../../types';
import { formatAmount } from '../../utils/expenseUtils';
import Button from '../common/Button';

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const CardHeader = styled(FlexContainer)`
  justify-content: space-between;
  align-items: center;
`;

const ExpenseDate = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const Amount = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const Description = styled.p`
  margin: 0;
`;

const Category = styled.span`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.background};
  padding: 2px 6px;
  border-radius: 12px;
  font-size: ${({ theme }) => theme.fontSizes.small};
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
      <Padding size="medium">
        <CardHeader>
          <ExpenseDate>{format(new Date(expense.date), 'yyyy-MM-dd')}</ExpenseDate>
          <Amount>${formatAmount(expense.amount)}</Amount>
        </CardHeader>
        <Margin size="small" direction="vertical">
          <Description>{expense.description}</Description>
        </Margin>
        <FlexContainer justify="space-between" align="center">
          <FlexContainer>
            <Category>{expense.category}</Category>
            {expense.subcategory && (
              <Margin size="xsmall" direction="left">
                <Category>{expense.subcategory}</Category>
              </Margin>
            )}
          </FlexContainer>
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
      </Padding>
    </Card>
  );
};

export default ExpenseCard;
