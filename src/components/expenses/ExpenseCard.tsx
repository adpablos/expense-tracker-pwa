/* eslint-disable import/no-named-as-default */
import React from 'react';
import type { IconBaseProps } from 'react-icons';
import { FaEdit, FaTrash } from 'react-icons/fa';
import styledComponents from 'styled-components';

import { FlexContainer, Margin } from '../../styles/utilities';
import { Expense } from '../../types';
import { formatDateForDisplay } from '../../utils/dateUtils';
import { formatAmount } from '../../utils/expenseUtils';
import Button from '../common/Button';
import Tag from '../ui/Tag';

const Card = styledComponents.div`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
  padding: ${({ theme }) => theme.padding.medium};
  margin-bottom: ${({ theme }) => theme.space.medium};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.padding.small};
  }
`;

const CardHeader = styledComponents(FlexContainer)`
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space.small};
`;

const ExpenseDate = styledComponents.span`
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.small};
`;

const Amount = styledComponents.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.medium};
`;

const Description = styledComponents.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  margin-bottom: ${({ theme }) => theme.space.small};
`;

const CategoryGroup = styledComponents.div`
  display: inline-flex;
  gap: ${({ theme }) => theme.space.xsmall};
`;

const ActionButton = styledComponents(Button)`
  padding: ${({ theme }) => theme.space.xsmall};
`;

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

const EditIcon = FaEdit as unknown as React.ComponentType<IconBaseProps>;
const TrashIcon = FaTrash as unknown as React.ComponentType<IconBaseProps>;

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onEdit, onDelete }) => {
  return (
    <Card>
      <CardHeader>
        <ExpenseDate>{formatDateForDisplay(expense.expenseDatetime)}</ExpenseDate>
        <Amount>${formatAmount(expense.amount)}</Amount>
      </CardHeader>
      <Description>{expense.description}</Description>
      <FlexContainer justify="space-between" align="center">
        <CategoryGroup>
          <Tag variant="primary">{expense.category}</Tag>
          {expense.subcategory && <Tag>{expense.subcategory}</Tag>}
        </CategoryGroup>
        <FlexContainer>
          <ActionButton variant="primary" onClick={() => onEdit(expense)} isRound size="small">
            <EditIcon />
          </ActionButton>
          <Margin size="xsmall" direction="left">
            <ActionButton variant="danger" onClick={() => onDelete(expense)} isRound size="small">
              <TrashIcon />
            </ActionButton>
          </Margin>
        </FlexContainer>
      </FlexContainer>
    </Card>
  );
};

export default ExpenseCard;
