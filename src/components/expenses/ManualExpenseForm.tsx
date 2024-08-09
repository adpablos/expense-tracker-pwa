/* eslint-disable import/no-named-as-default */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { RootState, AppDispatch } from '../../store';
import { fetchCategories } from '../../store/slices/categoriesSlice';
import { createExpense } from '../../store/slices/expensesSlice';
import { ExpenseInput, Expense } from '../../types';
import { createLocalNoonDate, dateToString, getCurrentLocalDate } from '../../utils/dateUtils';
import Button from '../common/Button';
import DatePicker from '../common/DatePicker';
import ErrorModal from '../common/ErrorModal';
import Input from '../common/Input';
import LoadingOverlay from '../common/LoadingOverlay';
import Select from '../common/Select';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.small};
  width: 100%;
`;

const SubmitButton = styled(Button)`
  margin-top: ${({ theme }) => theme.space.medium};
`;

interface ManualExpenseFormProps {
  onSubmit: (expense: Expense) => void;
}

const ManualExpenseForm: React.FC<ManualExpenseFormProps> = ({ onSubmit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, subcategories } = useSelector((state: RootState) => state.categories);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    categoryId: '',
    subcategoryId: '',
    expenseDatetime: getCurrentLocalDate(),
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
      const localNoonDate = createLocalNoonDate(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
      );
      setFormData((prev) => ({ ...prev, date: localNoonDate }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const selectedCategory = categories.find((cat) => cat.id === formData.categoryId);
    const selectedSubcategory = subcategories.find((sub) => sub.id === formData.subcategoryId);

    if (!selectedCategory) {
      setErrorMessage('Por favor, selecciona una categoría válida.');
      setIsLoading(false);
      return;
    }

    const expenseData: ExpenseInput = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: selectedCategory.name,
      subcategory: selectedSubcategory?.name || 'Sin subcategoría',
      expenseDatetime: dateToString(formData.expenseDatetime),
    };

    try {
      const result = await dispatch(createExpense(expenseData)).unwrap();
      setIsLoading(false);
      onSubmit(result);
    } catch (error) {
      setIsLoading(false);
      if (typeof error === 'string') {
        setErrorMessage(error);
      } else if (error && typeof error === 'object' && 'message' in error) {
        setErrorMessage(error.message as string);
      } else {
        setErrorMessage('Error inesperado al crear el gasto');
      }
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
        selected={formData.expenseDatetime}
        onChange={handleDateChange}
        dateFormat="yyyy/MM/dd"
        placeholderText="Fecha del gasto"
      />
      <SubmitButton type="submit" variant="primary">
        Registrar gasto
      </SubmitButton>
      {isLoading && <LoadingOverlay message="Procesando gasto..." />}
      <ErrorModal
        isOpen={!!errorMessage}
        onClose={() => setErrorMessage(null)}
        message={errorMessage || ''}
      />
    </Form>
  );
};

export default ManualExpenseForm;
