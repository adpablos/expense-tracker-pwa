// src/components/categories/SubcategoryForm.tsx

import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { AppDispatch } from '../../store';
import { createSubcategory } from '../../store/slices/categoriesSlice';
import Button from '../common/Button';
import Input from '../common/Input';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.small};
`;

const InputWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.xsmall};
`;

const StyledInput = styled(Input)`
  flex-grow: 1;
`;

const AddButton = styled(Button)`
  padding: ${({ theme }) => `${theme.space.xsmall} ${theme.space.small}`};
  font-size: ${({ theme }) => theme.fontSizes.small};
  white-space: nowrap;
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
      <InputWrapper>
        <StyledInput
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre de la nueva subcategoría"
        />
        <AddButton type="submit" variant="primary">
          <FaPlus /> Añadir
        </AddButton>
      </InputWrapper>
    </Form>
  );
};

export default SubcategoryForm;
