/* eslint-disable import/no-named-as-default */
import React, { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { RootState } from '../../store';
import { Expense } from '../../types';
import { stringToDate } from '../../utils/expenseUtils';
import Button from '../common/Button';
import DatePicker from '../common/DatePicker';
import Input from '../common/Input';
import Select from '../common/Select';

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
  onSave: (updatedExpense: Expense) => void;
  onCancel: () => void;
}

const EditExpenseModal: React.FC<EditExpenseModalProps> = ({ expense, onSave, onCancel }) => {
  const [editedExpense, setEditedExpense] = useState<Expense>({ ...expense });
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    const date = stringToDate(expense.date);
    return date ? new Date(date.getTime() - date.getTimezoneOffset() * 60000) : null;
  });
  const [amountError, setAmountError] = useState<string | null>(null);
  const categories = useSelector((state: RootState) => state.categories.categories);
  const subcategories = useSelector((state: RootState) => state.categories.subcategories);

  useEffect(() => {
    setEditedExpense({ ...expense });
    const date = stringToDate(expense.date);
    setSelectedDate(date ? new Date(date.getTime() - date.getTimezoneOffset() * 60000) : null);
  }, [expense]);

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
      const formattedDate = date.toISOString().split('T')[0];
      setEditedExpense((prev) => ({ ...prev, date: formattedDate }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amountError) {
      onSave(editedExpense);
    }
  };

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const subcategoryOptions = subcategories
    .filter((sub) => sub.categoryId === editedExpense.categoryId)
    .map((sub) => ({
      value: sub.id,
      label: sub.name,
    }));

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
      </ModalContent>
    </ModalOverlay>
  );
};

export default EditExpenseModal;
