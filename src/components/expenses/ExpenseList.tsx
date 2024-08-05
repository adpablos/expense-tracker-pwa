import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { fetchExpenses, deleteExpense, updateExpense } from '../../store/slices/expensesSlice';
import { RootState, AppDispatch } from '../../store';
import { Expense } from '../../types';
import ExpenseTable from './ExpenseTable';
import ExpenseFilters from './ExpenseFilters';
import Pagination from '../common/Pagination';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import EditExpenseModal from './EditExpenseModal';
import { theme } from '../../styles/theme';

const ListContainer = styled.div`
  padding: ${theme.padding.medium};
`;

const ExpenseList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: expenses, status, error, totalPages } = useSelector((state: RootState) => state.expenses);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: ''
  });
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  useEffect(() => {
    dispatch(fetchExpenses({ page: currentPage, ...filters }));
  }, [dispatch, currentPage, filters]);

  const handleDelete = (expense: Expense) => {
    setExpenseToDelete(expense);
  };

  const confirmDelete = () => {
    if (expenseToDelete) {
      dispatch(deleteExpense(expenseToDelete.id));
      setExpenseToDelete(null);
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
  };

  const handleUpdate = (updatedExpense: Expense) => {
    dispatch(updateExpense({ id: updatedExpense.id, expenseData: updatedExpense }));
    setEditingExpense(null);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (status === 'loading') return <div>Cargando gastos...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;

  return (
    <ListContainer>
      <ExpenseFilters onFilterChange={handleFilterChange} currentFilters={filters} />
      <ExpenseTable
        expenses={expenses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <DeleteConfirmationModal
        isOpen={!!expenseToDelete}
        expense={expenseToDelete}
        onConfirm={confirmDelete}
        onCancel={() => setExpenseToDelete(null)}
      />
      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          onSave={handleUpdate}
          onCancel={() => setEditingExpense(null)}
        />
      )}
    </ListContainer>
  );
};

export default ExpenseList;