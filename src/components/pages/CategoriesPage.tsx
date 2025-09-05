/* eslint-disable import/no-named-as-default */
import React from 'react';
import styledComponents from 'styled-components';

import CategoriesManager from '../categories/CategoriesManager';
import Container from '../ui/Container';
import PageHeader from '../ui/PageHeader';

const PageContainer = styledComponents(Container)`
  padding-top: ${({ theme }) => theme.space.large};
  padding-bottom: ${({ theme }) => theme.space.large};
`;

const HeaderSpacer = styledComponents.div`
  margin-bottom: ${({ theme }) => theme.space.medium};
`;

const CategoriesPage: React.FC = () => {
  return (
    <PageContainer>
      <HeaderSpacer>
        <PageHeader title="Categorías" subtitle="Organiza cómo entiendes tus gastos" />
      </HeaderSpacer>
      <CategoriesManager />
    </PageContainer>
  );
};

export default CategoriesPage;
