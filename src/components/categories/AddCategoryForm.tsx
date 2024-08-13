import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import styled from 'styled-components';

import Button from '../common/Button';
import Input from '../common/Input';

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.small};
`;

const InputWrapper = styled.div`
  flex: 1;
  min-width: 200px;
`;

const StyledInput = styled(Input)`
  width: 100%;
  height: 40px; // Asegurar que el input tenga la misma altura que el botón
`;

const AddButton = styled(Button)`
  height: 40px;
  padding: 0 ${({ theme }) => theme.space.medium};
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AddCategoryForm: React.FC<{ onAddCategory: (name: string) => void }> = ({
  onAddCategory,
}) => {
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryName.trim()) {
      onAddCategory(categoryName.trim());
      setCategoryName('');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputWrapper>
        <StyledInput
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Ej: Alimentación, Transporte"
        />
      </InputWrapper>
      <AddButton type="submit">
        <FaPlus style={{ marginRight: '8px' }} />
        Añadir Categoría
      </AddButton>
    </Form>
  );
};

export default AddCategoryForm;
