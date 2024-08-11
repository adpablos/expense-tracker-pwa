// src/components/pages/CategoriesPage.tsx

import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import styled from 'styled-components';

import CategoryForm from '../categories/CategoryForm';
import CategoryList from '../categories/CategoryList';
import Button from '../common/Button';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.space.large};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.space.medium};
`;

const AddCategoryButton = styled(Button)`
  margin-bottom: ${({ theme }) => theme.space.medium};
`;

const CategoriesPage: React.FC = () => {
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  return (
    <PageContainer>
      <Title>Gestión de Categorías</Title>
      <AddCategoryButton onClick={() => setIsAddingCategory(true)}>
        <FaPlus /> Añadir Categoría
      </AddCategoryButton>
      {isAddingCategory && <CategoryForm onComplete={() => setIsAddingCategory(false)} />}
      <CategoryList />
    </PageContainer>
  );
};

export default CategoriesPage;
