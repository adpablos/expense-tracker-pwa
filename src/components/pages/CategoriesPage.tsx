/* eslint-disable import/no-named-as-default */
import React from 'react';
import styled from 'styled-components';

import CategoriesManager from '../categories/CategoriesManager';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.space.large};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.space.medium};
  text-align: left;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const CategoriesPage: React.FC = () => {
  return (
    <PageContainer>
      <Title>Gestión de Categorías</Title>
      <CategoriesManager />
    </PageContainer>
  );
};

export default CategoriesPage;
