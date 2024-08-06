// src/components/pages/HomePage.tsx
import React from 'react';
import styled from 'styled-components';
import ExpenseForm from '../expenses/ExpenseForm';
import MonthlyExpensesChart from '../expenses/MonthlyExpensesChart';
import RecentExpenses from '../expenses/RecentExpenses';
import { theme } from '../../styles/theme';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.padding.large};
  padding: ${theme.padding.medium};
`;

const Title = styled.h1`
  color: ${theme.colors.primary};
  font-size: ${theme.fontSize.large};
  margin-bottom: ${theme.padding.small};
`;

const Section = styled.section`
  background-color: ${theme.colors.backgroundLight};
  border-radius: ${theme.borderRadius};
  padding: ${theme.padding.medium};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  color: ${theme.colors.text};
  font-size: ${theme.fontSize.medium};
  margin-bottom: ${theme.padding.medium};
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
        <MonthlyExpensesChart />
      </Section>
      <Section>
        <SectionTitle>Gastos Recientes</SectionTitle>
        <RecentExpenses />
      </Section>
    </HomeContainer>
  );
};

export default HomePage;