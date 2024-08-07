// src/components/expenses/ManualExpenseForm.tsx
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components';

import { useErrorHandler } from '../../hooks/useErrorHandler';
import { RootState, AppDispatch } from '../../store';
import { fetchCategories } from '../../store/slices/categoriesSlice';
import { createExpense } from '../../store/slices/expensesSlice';
import { StyledInput, StyledSelect, StyledDatePicker } from '../../styles/formStyles';
import { theme } from '../../styles/theme';
import { ExpenseInput, Expense } from '../../types';
import 'react-datepicker/dist/react-datepicker.css';
import LoadingOverlay from '../common/LoadingOverlay';

// Register the locale with react-datepicker
registerLocale('es', es);

const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: ${theme.padding.small};

  @media (min-width: 768px) {
    padding: ${theme.padding.medium};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.padding.small};
  width: 100%;
`;

const SubmitButton = styled.button`
  padding: ${theme.padding.medium};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.background};
  border: none;
  border-radius: ${theme.borderRadius};
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${theme.colors.primaryHover};
  }
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.error};
  margin-top: ${theme.padding.small};
  font-size: 0.9rem;
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
      date: format(formData.date, 'yyyy-MM-dd'),
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

  const filteredSubcategories = subcategories.filter(
    (sub) => sub.categoryId === formData.categoryId
  );

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <StyledInput
          name="description"
          type="text"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Descripción del gasto"
          required
        />
        <StyledInput
          name="amount"
          type="number"
          inputMode="decimal"
          pattern="[0-9]*"
          value={formData.amount}
          onChange={handleAmountChange}
          placeholder="Cantidad"
          required
        />
        <StyledSelect
          name="categoryId"
          value={formData.categoryId}
          onChange={handleInputChange}
          required
          title={categories.find((cat) => cat.id === formData.categoryId)?.name || ''}
        >
          <option value="">Selecciona una categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </StyledSelect>
        <StyledSelect
          name="subcategoryId"
          value={formData.subcategoryId}
          onChange={handleInputChange}
          disabled={!formData.categoryId}
          title={subcategories.find((sub) => sub.id === formData.subcategoryId)?.name || ''}
        >
          <option value="">Selecciona una subcategoría</option>
          {filteredSubcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </option>
          ))}
        </StyledSelect>
        <StyledDatePicker>
          <DatePicker
            selected={formData.date}
            onChange={handleDateChange}
            dateFormat="yyyy/MM/dd"
            locale="es"
          />
        </StyledDatePicker>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <SubmitButton type="submit">Registrar gasto</SubmitButton>
        {isLoading && <LoadingOverlay message="Procesando gasto..." />}
      </Form>
    </FormContainer>
  );
};

export default ManualExpenseForm;
