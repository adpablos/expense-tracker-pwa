/* eslint-disable import/no-named-as-default */
// src/components/categories/CategoryForm.tsx

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { AppDispatch } from '../../store';
import { createCategory } from '../../store/slices/categoriesSlice';
import Button from '../common/Button';
import Input from '../common/Input';

const Form = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.space.medium};
  margin-bottom: ${({ theme }) => theme.space.large};
`;

const CategoryForm: React.FC = () => {
  const [name, setName] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      dispatch(createCategory({ name }));
      setName('');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre de la nueva categoría"
      />
      <Button type="submit">Añadir Categoría</Button>
    </Form>
  );
};

export default CategoryForm;
