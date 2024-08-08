/* eslint-disable import/no-named-as-default */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { useErrorHandler } from '../../hooks/useErrorHandler';
import { RootState, AppDispatch } from '../../store';
import { fetchCategories } from '../../store/slices/categoriesSlice';
import { createExpense } from '../../store/slices/expensesSlice';
import { ExpenseInput, Expense } from '../../types';
import Button from '../common/Button';
import DatePicker from '../common/DatePicker';
import Input from '../common/Input';
import LoadingOverlay from '../common/LoadingOverlay';
import Select from '../common/Select';

const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.small};
  width: 100%;
`;

interface ManualExpenseFormProps {
  onSubmit: (expense: Expense) => void;
}

const ManualExpenseForm: React.FC<ManualExpenseFormProps> = ({ onSubmit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, subcategories } = useSelector((state: RootState) => state.categories);
  const { error, handleError, clearError } = useErrorHandler();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    categoryId: '',
    subcategoryId: '',
    date: new Date(),
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
      setFormData((prev) => ({ ...prev, amount: value }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData((prev) => ({ ...prev, date }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsLoading(true);

    const selectedCategory = categories.find((cat) => cat.id === formData.categoryId);
    const selectedSubcategory = subcategories.find((sub) => sub.id === formData.subcategoryId);

    if (!selectedCategory) {
      handleError('Por favor, selecciona una categoría válida.');
      setIsLoading(false);
      return;
    }

    const expenseData: ExpenseInput = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: selectedCategory.name,
      subcategory: selectedSubcategory?.name || 'Sin subcategoría',
      date: formData.date.toISOString().split('T')[0],
    };

    try {
      const result = await dispatch(createExpense(expenseData));
      if (createExpense.fulfilled.match(result)) {
        setIsLoading(false);
        onSubmit(result.payload);
      } else {
        throw new Error(result.error.message || 'Error al crear el gasto');
      }
    } catch (error) {
      setIsLoading(false);
      handleError(error instanceof Error ? error.message : 'Error inesperado al crear el gasto');
    }
  };

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const subcategoryOptions = subcategories
    .filter((sub) => sub.categoryId === formData.categoryId)
    .map((subcategory) => ({
      value: subcategory.id,
      label: subcategory.name,
    }));

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <Input
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Descripción del gasto"
          required
        />
        <Input
          name="amount"
          type="number"
          inputMode="decimal"
          pattern="[0-9]*"
          value={formData.amount}
          onChange={handleAmountChange}
          placeholder="Cantidad"
          required
        />
        <Select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleInputChange}
          options={categoryOptions}
          placeholder="Selecciona una categoría"
          required
        />
        <Select
          name="subcategoryId"
          value={formData.subcategoryId}
          onChange={handleInputChange}
          options={subcategoryOptions}
          placeholder="Selecciona una subcategoría"
          disabled={!formData.categoryId}
        />
        <DatePicker
          selected={formData.date}
          onChange={handleDateChange}
          dateFormat="yyyy/MM/dd"
          placeholderText="Fecha del gasto"
        />
        {error && <p>{error}</p>}
        <Button type="submit" variant="primary">
          Registrar gasto
        </Button>
        {isLoading && <LoadingOverlay message="Procesando gasto..." />}
      </Form>
    </FormContainer>
  );
};

export default ManualExpenseForm;
