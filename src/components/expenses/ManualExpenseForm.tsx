/* eslint-disable import/no-named-as-default */
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import { RootState, AppDispatch } from '../../store';
import { fetchCategories } from '../../store/slices/categoriesSlice';
import { ExpenseInput } from '../../types';
import { createLocalNoonDate, dateToString, getCurrentLocalDate } from '../../utils/dateUtils';
import { translateErrorMessage } from '../../utils/errorUtils';
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
  onSubmit: (expense: ExpenseInput) => void;
}

const ManualExpenseForm: React.FC<ManualExpenseFormProps> = React.memo(({ onSubmit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, subcategories, status } = useSelector((state: RootState) => state.categories);
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
    if (status === 'idle') {
      console.log('Dispatching fetchCategories from ManualExpenseForm');
      dispatch(fetchCategories());
    } else {
      console.log('ManualExpenseForm categories status:', status);
    }
  }, [dispatch, status]);

  console.log('ManualExpenseForm render, categories status:', status);

  if (status === 'loading' || status === 'idle') {
    return <LoadingOverlay message="Cargando categorías..." />;
  }

  if (status === 'failed') {
    return <div>Error al cargar las categorías. Por favor, intente de nuevo.</div>;
  }

  console.log('Rendering ManualExpenseForm with categories:', categories.length);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
      setFormData((prev) => ({ ...prev, amount: value }));
    }
  }, []);

  const handleDateChange = useCallback((date: Date | null) => {
    if (date) {
      const localNoonDate = createLocalNoonDate(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
      );
      setFormData((prev) => ({ ...prev, expenseDatetime: localNoonDate }));
    }
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isLoading) return;
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
        await onSubmit(expenseData);
        // Limpiar el formulario después de un envío exitoso
        setFormData({
          description: '',
          amount: '',
          categoryId: '',
          subcategoryId: '',
          expenseDatetime: getCurrentLocalDate(),
        });
      } catch (error) {
        if (typeof error === 'string') {
          setErrorMessage(translateErrorMessage(error));
        } else if (error && typeof error === 'object' && 'message' in error) {
          setErrorMessage(translateErrorMessage(error.message as string));
        } else {
          setErrorMessage('Error inesperado al crear el gasto');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [formData, categories, subcategories, onSubmit]
  );

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
      <SubmitButton type="submit" variant="primary" disabled={isLoading}>
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
});

ManualExpenseForm.displayName = 'ManualExpenseForm';
export default ManualExpenseForm;
