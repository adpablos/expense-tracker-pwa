import React, { useState } from 'react';
import { useSelector } from 'react-redux';
// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components';

import { RootState } from '../../store';
import { theme } from '../../styles/theme';
import { Expense } from '../../types';

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
  background-color: ${theme.colors.background};
  padding: 2rem;
  border-radius: ${theme.borderRadius};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 400px;
  max-width: 90%;
`;

const Title = styled.h2`
  color: ${theme.colors.text};
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius};
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button<{ isPrimary?: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: ${theme.borderRadius};
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;

  background-color: ${(props) => (props.isPrimary ? theme.colors.primary : theme.colors.error)};
  color: ${theme.colors.background};

  &:hover {
    background-color: ${(props) =>
      props.isPrimary ? theme.colors.primaryHover : theme.colors.errorHover};
  }
`;

const ErrorMessage = styled.p`
  color: ${theme.colors.error};
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

interface EditExpenseModalProps {
  expense: Expense;
  onSave: (updatedExpense: Expense) => void;
  onCancel: () => void;
}

const EditExpenseModal: React.FC<EditExpenseModalProps> = ({ expense, onSave, onCancel }) => {
  const [editedExpense, setEditedExpense] = useState<Expense>(expense);
  const [amountError, setAmountError] = useState<string | null>(null);
  const categories = useSelector((state: RootState) => state.categories.categories);
  const subcategories = useSelector((state: RootState) => state.categories.subcategories);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedExpense((prev) => ({ ...prev, [name]: value }));

    if (name === 'amount') {
      validateAmount(value);
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

  return (
    <ModalOverlay onClick={onCancel}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
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
            value={editedExpense.amount}
            onChange={handleChange}
            placeholder="Cantidad"
          />
          {amountError && <ErrorMessage>{amountError}</ErrorMessage>}
          <Select name="category" value={editedExpense.category} onChange={handleChange}>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </Select>
          <Select name="subcategory" value={editedExpense.subcategory} onChange={handleChange}>
            {subcategories
              .filter(
                (sub) =>
                  sub.categoryId ===
                  categories.find((cat) => cat.name === editedExpense.category)?.id
              )
              .map((subcategory) => (
                <option key={subcategory.id} value={subcategory.name}>
                  {subcategory.name}
                </option>
              ))}
          </Select>
          <Input name="date" type="date" value={editedExpense.date} onChange={handleChange} />
          <ButtonContainer>
            <Button type="button" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" isPrimary>
              Guardar
            </Button>
          </ButtonContainer>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default EditExpenseModal;
