// src/components/pages/HomePage.tsx
import React from 'react';
import styled from 'styled-components';
import ExpenseForm from '../expenses/ExpenseForm';
import MonthlyExpensesChart from '../expenses/MonthlyExpensesChart';
import { theme } from '../../styles/theme';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.padding.large};
`;

const Title = styled.h1`
  color: ${theme.colors.primary};
  font-size: 2rem;
  margin-bottom: ${theme.padding.large};
  text-align: center;
`;

const Section = styled.section`
  background-color: ${theme.colors.backgroundLight};
  border-radius: ${theme.borderRadius};
  padding: ${theme.padding.large};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: ${theme.padding.large};
`;

const SectionTitle = styled.h2`
  color: ${theme.colors.text};
  font-size: 1.5rem;
  margin-bottom: ${theme.padding.medium};
  text-align: center;
`;

const HomePage: React.FC = () => {
  return (
    <HomeContainer>
      <Title>Gestor de Gastos</Title>
      <Section>
        <SectionTitle>Registrar Nuevo Gasto</SectionTitle>
        <ExpenseForm />
      </Section>
      <Section>
        <SectionTitle>Distribución de gastos por categoría este mes</SectionTitle>
        <MonthlyExpensesChart />
      </Section>
    </HomeContainer>
  );
};

export default HomePage;