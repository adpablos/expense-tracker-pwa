/* eslint-disable import/no-named-as-default */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { RootState, AppDispatch } from '../../store';
import { fetchExpenses, deleteExpense, updateExpense } from '../../store/slices/expensesSlice';
import { Margin, FlexContainer } from '../../styles/utilities';
import { Expense } from '../../types';
import { FilterValues } from '../../types/filters';
import Pagination from '../common/Pagination';
import { Container, Row, Col } from '../layout/Grid';

import DeleteConfirmationModal from './DeleteConfirmationModal';
import EditExpenseModal from './EditExpenseModal';
import ExpenseCard from './ExpenseCard';
import ExpenseFilters from './ExpenseFilters';
import ExpenseTable from './ExpenseTable';

const ListContainer = styled(Container)`
  ${({ theme }) => `
    @media (max-width: ${theme.breakpoints.tablet}) {
      padding-left: ${theme.space.small};
      padding-right: ${theme.space.small};
    }
  `}
`;

const ExpenseList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items: expenses,
    status,
    error,
    totalPages,
  } = useSelector((state: RootState) => state.expenses);
  const categories = useSelector((state: RootState) => state.categories.categories);
  const subcategories = useSelector((state: RootState) => state.categories.subcategories);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterValues>({
    startDate: null,
    endDate: null,
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
    dispatch(
      fetchExpenses({
        page: currentPage,
        startDate: filters.startDate?.toISOString().split('T')[0],
        endDate: filters.endDate?.toISOString().split('T')[0],
      })
    );
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
    const category = categories.find((cat) => cat.name === expense.category);
    const subcategory = subcategories.find(
      (sub) => sub.name === expense.subcategory && sub.categoryId === category?.id
    );

    setExpenseToEdit({
      ...expense,
      categoryId: category?.id || '',
      subcategoryId: subcategory?.id || '',
    });
  };

  const handleUpdate = (updatedExpense: Expense) => {
    const category = categories.find((cat) => cat.id === updatedExpense.categoryId);
    const subcategory = subcategories.find((sub) => sub.id === updatedExpense.subcategoryId);

    dispatch(
      updateExpense({
        id: updatedExpense.id,
        expenseData: {
          ...updatedExpense,
          category: category?.name || '',
          subcategory: subcategory?.name || 'Sin subcategoría',
        },
      })
    );
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
      <Margin size="large" direction="bottom">
        <ExpenseFilters onFilterChange={handleFilterChange} currentFilters={filters} />
      </Margin>
      <Row>
        <Col xs={12}>
          {isMobile ? (
            <FlexContainer direction="column">
              {expenses.map((expense) => (
                <Margin key={expense.id} size="small" direction="bottom">
                  <ExpenseCard expense={expense} onEdit={handleEdit} onDelete={handleDelete} />
                </Margin>
              ))}
            </FlexContainer>
          ) : (
            <ExpenseTable expenses={expenses} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </Col>
      </Row>
      <Margin size="large" direction="top">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Margin>
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
