/* eslint-disable import/no-named-as-default */
// src/components/pages/CategoriesPage.tsx

import React from 'react';
import styled from 'styled-components';

import CategoryForm from '../categories/CategoryForm';
import CategoryList from '../categories/CategoryList';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.space.large};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.space.medium};
`;

const CategoriesPage: React.FC = () => {
  return (
    <PageContainer>
      <Title>Gestión de Categorías</Title>
      <CategoryForm />
      <CategoryList />
    </PageContainer>
  );
};

export default CategoriesPage;
