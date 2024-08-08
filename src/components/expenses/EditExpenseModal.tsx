/* eslint-disable import/no-named-as-default */
import React, { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import { RootState, AppDispatch } from '../../store';
import { fetchCategories } from '../../store/slices/categoriesSlice';
import { Expense } from '../../types';
import { dateToString, stringToDate } from '../../utils/dateUtils';
import Button from '../common/Button';
import DatePicker from '../common/DatePicker';
import ErrorModal from '../common/ErrorModal';
import Input from '../common/Input';
import LoadingOverlay from '../common/LoadingOverlay';
import Select from '../common/Select';
import SuccessModal from '../common/SuccessModal';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  width: 400px;
  max-width: 90%;
  text-align: center;
`;

const Icon = styled(FaEdit)`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
`;

interface EditExpenseModalProps {
  expense: Expense;
  onSave: (updatedExpense: Expense) => Promise<void>;
  onCancel: () => void;
}

const EditExpenseModal: React.FC<EditExpenseModalProps> = ({ expense, onSave, onCancel }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [editedExpense, setEditedExpense] = useState<Expense>({ ...expense });
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    return stringToDate(expense.date);
  });
  const [amountError, setAmountError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const categories = useSelector((state: RootState) => state.categories.categories);
  const subcategories = useSelector((state: RootState) => state.categories.subcategories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    setEditedExpense({ ...expense });
    setSelectedDate(stringToDate(expense.date));
  }, [expense]);

  useEffect(() => {
    if (categories.length > 0 && subcategories.length > 0) {
      const category = categories.find((cat) => cat.name === expense.category) || {
        id: 'custom',
        name: expense.category,
      };
      const subcategory = subcategories.find(
        (sub) => sub.name === expense.subcategory && sub.categoryId === category?.id
      ) || { id: 'custom', name: expense.subcategory, categoryId: category.id };

      setEditedExpense((prev) => ({
        ...prev,
        categoryId: category.id,
        subcategoryId: subcategory.id,
      }));
    }
  }, [categories, subcategories, expense]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedExpense((prev) => ({ ...prev, [name]: value }));

    if (name === 'amount') {
      validateAmount(value);
    }

    if (name === 'categoryId') {
      const category = categories.find((cat) => cat.id === value);
      setEditedExpense((prev) => ({
        ...prev,
        categoryId: value,
        category: category?.name || '',
        subcategoryId: '',
        subcategory: 'Sin subcategoría',
      }));
    }

    if (name === 'subcategoryId') {
      const subcategory = subcategories.find((sub) => sub.id === value);
      setEditedExpense((prev) => ({
        ...prev,
        subcategoryId: value,
        subcategory: subcategory?.name || 'Sin subcategoría',
      }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      setEditedExpense((prev) => ({ ...prev, date: dateToString(date) }));
    }
  };

  const validateAmount = (value: string) => {
    const regex = /^\d+(\.\d{1,2})?$/;
    if (!regex.test(value)) {
      setAmountError('Por favor, ingrese una cantidad válida (ejemplo: 10.99)');
    } else {
      setAmountError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amountError) {
      setIsLoading(true);
      try {
        await onSave(editedExpense);
        setShowSuccessModal(true);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const categoryOptions = [
    ...categories.map((category) => ({
      value: category.id,
      label: category.name,
    })),
    ...(editedExpense.categoryId === 'custom'
      ? [{ value: 'custom', label: editedExpense.category }]
      : []),
  ];

  const subcategoryOptions = [
    { value: '', label: 'Sin subcategoría' },
    ...subcategories
      .filter((sub) => sub.categoryId === editedExpense.categoryId)
      .map((sub) => ({
        value: sub.id,
        label: sub.name,
      })),
    ...(editedExpense.subcategoryId === 'custom'
      ? [{ value: 'custom', label: editedExpense.subcategory }]
      : []),
  ];

  return (
    <ModalOverlay onClick={onCancel}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Icon />
        <Title>Editar Gasto</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            name="description"
            value={editedExpense.description}
            onChange={handleChange}
            placeholder="Descripción"
          />
          <Input
            name="amount"
            type="text"
            value={editedExpense.amount.toString()}
            onChange={handleChange}
            placeholder="Cantidad"
          />
          {amountError && <ErrorMessage>{amountError}</ErrorMessage>}
          <Select
            name="categoryId"
            value={editedExpense.categoryId || ''}
            onChange={handleChange}
            options={categoryOptions}
            placeholder="Selecciona una categoría"
          />
          <Select
            name="subcategoryId"
            value={editedExpense.subcategoryId || ''}
            onChange={handleChange}
            options={[{ value: '', label: 'Sin subcategoría' }, ...subcategoryOptions]}
            placeholder="Selecciona una subcategoría"
            disabled={!editedExpense.categoryId}
          />
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="yyyy/MM/dd"
            placeholderText="Fecha del gasto"
          />
          <ButtonContainer>
            <Button variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </ButtonContainer>
        </Form>
        {isLoading && <LoadingOverlay message="Procesando edición..." />}
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            onCancel();
          }}
          expense={editedExpense}
          title="Gasto registrado con éxito"
        />
        <ErrorModal
          isOpen={!!errorMessage}
          onClose={() => setErrorMessage(null)}
          message={errorMessage || ''}
        />
      </ModalContent>
    </ModalOverlay>
  );
};

export default EditExpenseModal;
