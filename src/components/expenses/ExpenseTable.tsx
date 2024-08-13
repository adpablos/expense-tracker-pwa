/* eslint-disable import/no-named-as-default */
import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import styled from 'styled-components';

import { Expense } from '../../types';
import { formatDateForDisplay } from '../../utils/dateUtils';
import { formatAmount } from '../../utils/expenseUtils';
import Button from '../common/Button';

const TableWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

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
  return (
    <TableWrapper>
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
              <TableCell>{formatDateForDisplay(expense.expenseDatetime)}</TableCell>
              <TableCell>{expense.description}</TableCell>
              <TableCell>${formatAmount(expense.amount)}</TableCell>
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
    </TableWrapper>
  );
};

export default ExpenseTable;
