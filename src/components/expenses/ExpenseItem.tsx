import React, { useState } from 'react';
import styled from 'styled-components';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { Expense } from '../../types';
import { theme } from '../../styles/theme';

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
  color: ${theme.colors.primary};

  &:hover {
    color: ${theme.colors.primaryHover};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.padding.small};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius};
`;

interface ExpenseItemProps {
  expense: Expense;
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedExpense, setEditedExpense] = useState(expense);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onEdit(editedExpense);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedExpense(expense);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedExpense(prev => ({ ...prev, [name]: value }));
  };

  if (isEditing) {
    return (
      <TableRow>
        <TableCell>
          <Input
            type="date"
            name="date"
            value={editedExpense.date}
            onChange={handleChange}
          />
        </TableCell>
        <TableCell>
          <Input
            type="text"
            name="description"
            value={editedExpense.description}
            onChange={handleChange}
          />
        </TableCell>
        <TableCell>
          <Input
            type="number"
            name="amount"
            value={editedExpense.amount}
            onChange={handleChange}
          />
        </TableCell>
        <TableCell>
          <Input
            type="text"
            name="category"
            value={editedExpense.category}
            onChange={handleChange}
          />
        </TableCell>
        <TableCell>
          <ActionButton onClick={handleSave} aria-label="Guardar cambios">
            <FaSave />
          </ActionButton>
          <ActionButton onClick={handleCancel} aria-label="Cancelar edición">
            <FaTimes />
          </ActionButton>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
      <TableCell>{expense.description}</TableCell>
      <TableCell>${expense.amount.toFixed(2)}</TableCell>
      <TableCell>{expense.category}</TableCell>
      <TableCell>
        <ActionButton onClick={handleEdit} aria-label="Editar gasto">
          <FaEdit />
        </ActionButton>
        <ActionButton onClick={() => onDelete(expense.id)} aria-label="Eliminar gasto">
          <FaTrash />
        </ActionButton>
      </TableCell>
    </TableRow>
  );
};

export default ExpenseItem;