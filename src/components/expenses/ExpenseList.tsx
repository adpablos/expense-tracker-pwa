import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { fetchExpenses, deleteExpense, updateExpense } from '../../store/slices/expensesSlice';
import { RootState, AppDispatch } from '../../store';
import { Expense } from '../../types';
import ExpenseItem from './ExpenseItem';
import ExpenseFilters from './ExpenseFilters';
import Pagination from '../common/Pagination';
import { formatAmount } from '../../utils/expenseUtils';
import { theme } from '../../styles/theme';

const ListContainer = styled.div`
  padding: ${theme.padding.medium};
`;

const ExpenseTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: ${theme.padding.medium};
`;

const TableHeader = styled.th`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.background};
  padding: ${theme.padding.small};
  text-align: left;
`;

const ExpenseList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: expenses, status, error, totalPages } = useSelector((state: RootState) => state.expenses);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    dispatch(fetchExpenses({ page: currentPage, ...filters }));
  }, [dispatch, currentPage, filters]);

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
      dispatch(deleteExpense(id));
    }
  };

  const handleEdit = (updatedExpense: Expense) => {
    dispatch(updateExpense({ id: updatedExpense.id, expenseData: updatedExpense }));
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
      <ExpenseFilters onFilterChange={handleFilterChange} />
      <ExpenseTable>
        <thead>
          <tr>
            <TableHeader>Fecha</TableHeader>
            <TableHeader>Descripción</TableHeader>
            <TableHeader>Monto</TableHeader>
            <TableHeader>Categoría</TableHeader>
            <TableHeader>Acciones</TableHeader>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense: Expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </tbody>
      </ExpenseTable>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </ListContainer>
  );
};

export default ExpenseList;