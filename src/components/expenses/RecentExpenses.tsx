import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { fetchExpenses, deleteExpense, updateExpense } from '../../store/slices/expensesSlice';
import { RootState, AppDispatch } from '../../store';
import { Expense } from '../../types';
import { formatAmount } from '../../utils/expenseUtils';
import EditExpenseModal from './EditExpenseModal';
import DeleteConfirmModal from './DeleteConfirmModal';

const RecentExpensesContainer = styled.section`
  margin-top: 20px;
`;

const ExpenseTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 10px;
  border-bottom: 2px solid #ddd;
`;

const TableCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const ActionButton = styled.button`
  margin-right: 5px;
  padding: 5px 10px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const RecentExpenses: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const recentExpenses = useSelector((state: RootState) => state.expenses.recentItems);
  const status = useSelector((state: RootState) => state.expenses.status);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);

  useEffect(() => {
    dispatch(fetchExpenses({ limit: 5 }));
  }, [dispatch]);

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
  };

  const handleDelete = (expense: Expense) => {
    setDeletingExpense(expense);
  };

  const confirmDelete = () => {
    if (deletingExpense) {
      dispatch(deleteExpense(deletingExpense.id));
      setDeletingExpense(null);
    }
  };

  const handleUpdate = (updatedExpense: Expense) => {
    dispatch(updateExpense({ id: updatedExpense.id, expenseData: updatedExpense }));
    setEditingExpense(null);
  };

  if (status === 'loading') return <p>Loading recent expenses...</p>;
  if (status === 'failed') return <p>Failed to load recent expenses. Please try again later.</p>;

  return (
    <RecentExpensesContainer>
      <h3>Recent Expenses</h3>
      {recentExpenses.length === 0 ? (
        <p>No recent expenses found.</p>
      ) : (
        <ExpenseTable>
          <thead>
            <tr>
              <TableHeader>Date</TableHeader>
              <TableHeader>Description</TableHeader>
              <TableHeader>Amount</TableHeader>
              <TableHeader>Category</TableHeader>
              <TableHeader>Subcategory</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </thead>
          <tbody>
            {recentExpenses.map((expense: Expense) => (
              <tr key={expense.id}>
                <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>${formatAmount(expense.amount)}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{expense.subcategory}</TableCell>
                <TableCell>
                  <ActionButton onClick={() => handleEdit(expense)}>Edit</ActionButton>
                  <ActionButton onClick={() => handleDelete(expense)}>Delete</ActionButton>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </ExpenseTable>
      )}
      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          onSave={handleUpdate}
          onCancel={() => setEditingExpense(null)}
        />
      )}
      {deletingExpense && (
        <DeleteConfirmModal
          expense={deletingExpense}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingExpense(null)}
        />
      )}
    </RecentExpensesContainer>
  );
};

export default RecentExpenses;