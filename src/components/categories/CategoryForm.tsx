/* eslint-disable import/no-named-as-default */
// src/components/categories/CategoryForm.tsx

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { AppDispatch } from '../../store';
import { createCategory, updateCategory } from '../../store/slices/categoriesSlice';
import { Category } from '../../types';
import Button from '../common/Button';
import Input from '../common/Input';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.small};
  margin-top: ${({ theme }) => theme.space.medium};
`;

interface CategoryFormProps {
  categoryToEdit?: Category;
  onComplete: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ categoryToEdit, onComplete }) => {
  const [name, setName] = useState(categoryToEdit?.name || '');
  const [isChanged, setIsChanged] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
    }
  }, [categoryToEdit]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setIsChanged(e.target.value !== categoryToEdit?.name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && isChanged) {
      if (categoryToEdit) {
        dispatch(updateCategory({ id: categoryToEdit.id, name }));
      } else {
        dispatch(createCategory({ name }));
      }
      setName('');
      setIsChanged(false);
      onComplete();
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type="text"
        value={name}
        onChange={handleNameChange}
        placeholder="Nombre de la categoría"
      />
      <Button type="submit" disabled={!isChanged}>
        {categoryToEdit ? 'Actualizar' : 'Añadir'} Categoría
      </Button>
    </Form>
  );
};

export default CategoryForm;
