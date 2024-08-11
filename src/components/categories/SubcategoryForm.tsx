// src/components/categories/SubcategoryForm.tsx

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { AppDispatch } from '../../store';
import { createSubcategory } from '../../store/slices/categoriesSlice';
import Button from '../common/Button';
import Input from '../common/Input';

const Form = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.space.medium};
  margin-top: ${({ theme }) => theme.space.medium};
`;

interface SubcategoryFormProps {
  categoryId: string;
  onComplete: () => void;
}

const SubcategoryForm: React.FC<SubcategoryFormProps> = ({ categoryId, onComplete }) => {
  const [name, setName] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      dispatch(createSubcategory({ categoryId, name }));
      setName('');
      onComplete();
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre de la nueva subcategoría"
      />
      <Button type="submit">Añadir Subcategoría</Button>
    </Form>
  );
};

export default SubcategoryForm;
