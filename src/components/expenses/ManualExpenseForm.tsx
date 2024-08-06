// src/components/expenses/ManualExpenseForm.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { createExpense } from '../../store/slices/expensesSlice';
import { RootState, AppDispatch } from '../../store';
import { ExpenseInput, Expense } from '../../types';
import { theme } from '../../styles/theme';
import { fetchCategories } from '../../store/slices/categoriesSlice';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { StyledInput, StyledSelect, StyledDatePicker } from '../../styles/formStyles';


const FormContainer = styled.div`
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
  padding: ${theme.padding.medium};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.padding.medium};
  width: 100%;
  max-width: 400px; // Ajusta esto según tus necesidades
  margin: 0 auto;
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.padding.medium};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius};
  font-size: 1rem;
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

const Select = styled.select`
  width: 100%;
  padding: ${theme.padding.medium};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius};
  font-size: 1rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23333' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 12px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  max-width: 100%;
  min-width: 100%;
  display: block;
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
      setFormData(prev => ({ ...prev, amount: value }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({ ...prev, date }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const selectedCategory = categories.find(cat => cat.id === formData.categoryId);
    const selectedSubcategory = subcategories.find(sub => sub.id === formData.subcategoryId);

    if (!selectedCategory) {
      handleError("Por favor, selecciona una categoría válida.");
      return;
    }

    const expenseData: ExpenseInput = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: selectedCategory.name,
      subcategory: selectedSubcategory?.name || 'Sin subcategoría',
      date: format(formData.date, 'yyyy-MM-dd')
    };

    try {
      const result = await dispatch(createExpense(expenseData));
      if (createExpense.fulfilled.match(result)) {
        onSubmit(result.payload);
      } else {
        throw new Error(result.error.message || "Error al crear el gasto");
      }
    } catch (error) {
      handleError(error instanceof Error ? error.message : "Error inesperado al crear el gasto");
    }
  };

  const filteredSubcategories = subcategories.filter(sub => sub.categoryId === formData.categoryId);

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
          type="text"
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
          title={categories.find(cat => cat.id === formData.categoryId)?.name || ''}
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
          title={subcategories.find(sub => sub.id === formData.subcategoryId)?.name || ''}
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
        <SubmitButton type="submit">
          Registrar gasto
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

export default ManualExpenseForm;
