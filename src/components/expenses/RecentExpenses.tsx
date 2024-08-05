import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { fetchExpenses, deleteExpense, updateExpense } from '../../store/slices/expensesSlice';
import { RootState, AppDispatch } from '../../store';
import { Expense } from '../../types';
import ExpenseTable from './ExpenseTable';
import EditExpenseModal from './EditExpenseModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { theme } from '../../styles/theme';

const RecentExpensesContainer = styled.section`
  margin-top: ${theme.padding.large};
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

  if (status === 'loading') return <p>Cargando gastos recientes...</p>;
  if (status === 'failed') return <p>Error al cargar los gastos recientes. Por favor, intente de nuevo más tarde.</p>;

  return (
    <RecentExpensesContainer>
      {recentExpenses.length === 0 ? (
        <p>No se encontraron gastos recientes.</p>
      ) : (
        <ExpenseTable
          expenses={recentExpenses}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          onSave={handleUpdate}
          onCancel={() => setEditingExpense(null)}
        />
      )}
      <DeleteConfirmationModal
        isOpen={!!deletingExpense}
        expense={deletingExpense}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingExpense(null)}
      />
    </RecentExpensesContainer>
  );
};

export default RecentExpenses;