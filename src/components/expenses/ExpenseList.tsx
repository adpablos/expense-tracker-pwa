/* eslint-disable import/no-named-as-default */
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { RootState, AppDispatch } from '../../store';
import {
  fetchExpenses,
  deleteExpense,
  updateExpense,
  FetchExpensesParams,
} from '../../store/slices/expensesSlice';
import { Margin, FlexContainer } from '../../styles/utilities';
import { Expense } from '../../types';
import { FilterValues } from '../../types/filters';
import ErrorModal from '../common/ErrorModal';
import LoadingOverlay from '../common/LoadingOverlay';
import Pagination from '../common/Pagination';
import Select from '../common/Select';
import SuccessModal from '../common/SuccessModal';
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

const PaginationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${({ theme }) => theme.space.large};
`;

const LimitSelector = styled.div`
  margin-bottom: ${({ theme }) => theme.space.medium};
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
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState<FilterValues>({
    startDate: null,
    endDate: null,
    category: null,
    subcategory: null,
    amount: null,
    description: null,
  });
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successExpense, setSuccessExpense] = useState<Expense | null>(null);
  const [successAction, setSuccessAction] = useState<'update' | 'delete' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isActionInProgress, setIsActionInProgress] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchExpensesList = useCallback(() => {
    setIsLoading(true);
    const apiParams: FetchExpensesParams = {
      page: currentPage,
      limit,
    };

    if (filters.startDate) apiParams.startDate = filters.startDate;
    if (filters.endDate) apiParams.endDate = filters.endDate;
    if (filters.category) apiParams.category = filters.category;
    if (filters.subcategory) apiParams.subcategory = filters.subcategory;
    if (filters.amount) apiParams.amount = parseFloat(filters.amount);
    if (filters.description) apiParams.description = filters.description;

    dispatch(
      fetchExpenses({
        ...apiParams,
        forceRefresh: true,
      })
    ).finally(() => setIsLoading(false));
  }, [dispatch, currentPage, limit, filters]);

  useEffect(() => {
    fetchExpensesList();
  }, [fetchExpensesList]);

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchExpensesList();
  }, [fetchExpensesList]);

  const handleDelete = (expense: Expense) => {
    setExpenseToDelete(expense);
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

  const confirmDelete = async () => {
    if (isActionInProgress) return;
    setIsActionInProgress(true);
    if (expenseToDelete) {
      setIsLoading(true);
      try {
        await dispatch(deleteExpense(expenseToDelete.id)).unwrap();
        setSuccessExpense(expenseToDelete);
        setSuccessAction('delete');
        setExpenseToDelete(null);
        fetchExpensesList();
      } catch (error) {
        console.error('Failed to delete expense:', error);
        setErrorMessage(
          error instanceof Error ? error.message : 'Ha ocurrido un error al eliminar el gasto'
        );
      } finally {
        setIsLoading(false);
        setIsActionInProgress(false);
      }
    }
  };

  const handleUpdate = async (updatedExpense: Expense) => {
    if (isActionInProgress) return;
    setIsActionInProgress(true);
    const category = categories.find((cat) => cat.id === updatedExpense.categoryId) || {
      id: 'custom',
      name: updatedExpense.category,
    };
    const subcategory = subcategories.find((sub) => sub.id === updatedExpense.subcategoryId) || {
      id: 'custom',
      name: updatedExpense.subcategory || 'Sin subcategoría',
    };

    setIsLoading(true);
    try {
      const result = await dispatch(
        updateExpense({
          id: updatedExpense.id,
          expenseData: {
            ...updatedExpense,
            category: category.name,
            subcategory: subcategory.name,
          },
        })
      ).unwrap();
      setSuccessExpense(result);
      setSuccessAction('update');
      setExpenseToEdit(null);
      fetchExpensesList();
    } catch (error) {
      console.error('Failed to update expense:', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Ha ocurrido un error al actualizar el gasto'
      );
    } finally {
      setIsLoading(false);
      setIsActionInProgress(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(event.target.value));
    setCurrentPage(1);
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
          {expenses.length === 0 ? (
            <div>No hay gastos para mostrar.</div>
          ) : isMobile ? (
            <FlexContainer direction="column">
              {expenses.map((expense: Expense) => (
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
      <PaginationContainer>
        <LimitSelector>
          <Select
            value={limit.toString()}
            onChange={handleLimitChange}
            options={[
              { value: '10', label: '10 por página' },
              { value: '25', label: '25 por página' },
              { value: '50', label: '50 por página' },
            ]}
          />
        </LimitSelector>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          maxDisplayedPages={5}
        />
      </PaginationContainer>
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
      <ErrorModal
        isOpen={!!errorMessage}
        onClose={() => setErrorMessage(null)}
        message={errorMessage || ''}
      />
      <SuccessModal
        isOpen={!!successExpense}
        onClose={() => {
          setSuccessExpense(null);
          setSuccessAction(null);
          fetchExpensesList(); // Refresh the list after success
        }}
        expense={successExpense}
        title={
          successAction === 'delete'
            ? 'Gasto eliminado con éxito'
            : successAction === 'update'
              ? 'Gasto actualizado con éxito'
              : ''
        }
      />
      {isLoading && <LoadingOverlay />}
    </ListContainer>
  );
};

export default ExpenseList;
