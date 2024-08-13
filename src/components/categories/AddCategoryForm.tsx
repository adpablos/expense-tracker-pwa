/* eslint-disable import/no-named-as-default */
import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import styled from 'styled-components';

import Button from '../common/Button';
import Input from '../common/Input';

const Form = styled.form`
  display: flex;
  flex-wrap: nowrap;
  gap: ${({ theme }) => theme.space.small};
  align-items: stretch;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const InputWrapper = styled.div`
  flex: 1;
  min-width: 0; // Permite que el input se encoja si es necesario
`;

const StyledInput = styled(Input)`
  width: 100%;
  height: 40px;
`;

const AddButton = styled(Button)<{ $isCompact: boolean }>`
  height: 40px;
  padding: ${({ $isCompact }) => ($isCompact ? '0 10px' : '0 20px')};
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0; // Evita que el botón se encoja

  span {
    display: ${({ $isCompact }) => ($isCompact ? 'none' : 'inline')};
    margin-left: 8px;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const AddCategoryForm: React.FC<{ onAddCategory: (name: string) => void }> = ({
  onAddCategory,
}) => {
  const [categoryName, setCategoryName] = useState('');
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsCompact(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      <AddButton type="submit" $isCompact={isCompact}>
        <FaPlus />
        <span>Añadir Categoría</span>
      </AddButton>
    </Form>
  );
};

export default AddCategoryForm;
