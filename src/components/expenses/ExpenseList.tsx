// src/components/expenses/ExpenseList.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { fetchExpenses, deleteExpense, updateExpense } from '../../store/slices/expensesSlice';
import { RootState, AppDispatch } from '../../store';
import { Expense } from '../../types';
import { FilterValues } from '../../types/filters';
import ExpenseTable from './ExpenseTable';
import ExpenseCard from './ExpenseCard';
import ExpenseFilters from './ExpenseFilters';
import Pagination from '../common/Pagination';
import { theme } from '../../styles/theme';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import EditExpenseModal from './EditExpenseModal';

const ListContainer = styled.div`
  padding: ${theme.padding.medium};
`;

const ExpenseList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items: expenses, status, error, totalPages } = useSelector((state: RootState) => state.expenses);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<FilterValues>({
      startDate: null,
      endDate: null
    });
    const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
    const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth <= 768);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    useEffect(() => {
      dispatch(fetchExpenses({ 
        page: currentPage, 
        startDate: filters.startDate?.toISOString().split('T')[0],
        endDate: filters.endDate?.toISOString().split('T')[0]
      }));
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
      setExpenseToEdit(expense);
    };
  
    const handleUpdate = (updatedExpense: Expense) => {
      dispatch(updateExpense({ id: updatedExpense.id, expenseData: updatedExpense }));
      setExpenseToEdit(null);
    };
  
    const handleFilterChange = (newFilters: FilterValues) => {
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
        {isMobile ? (
          expenses.map(expense => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <ExpenseTable
            expenses={expenses}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
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
        {expenseToEdit && (
          <EditExpenseModal
            expense={expenseToEdit}
            onSave={handleUpdate}
            onCancel={() => setExpenseToEdit(null)}
          />
        )}
      </ListContainer>
    );
  };
  
  export default ExpenseList;
