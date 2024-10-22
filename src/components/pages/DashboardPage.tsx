/* eslint-disable import/no-named-as-default */
import React from 'react';
import styled from 'styled-components';

import { useHouseholds } from '../../hooks/useHouseholds';
import { theme } from '../../styles/theme';
import ExpenseForm from '../expenses/ExpenseForm';
import MonthlyExpensesChart from '../expenses/MonthlyExpensesChart';
import { Col, Container, Row } from '../layout/Grid';

// Importa el componente RecentExpenses si existe
// import RecentExpenses from '../expenses/RecentExpenses';

const HomeContainer = styled(Container)`
  padding-top: ${theme.padding.large};
  padding-bottom: ${theme.padding.large};
`;

const Title = styled.h1`
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.xxlarge};
  margin-bottom: ${theme.padding.large};
  text-align: center;
`;

const Section = styled.section`
  background-color: ${theme.colors.backgroundLight};
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.padding.medium};
  box-shadow: ${theme.shadows.medium};
  height: 100%;
`;

const SectionTitle = styled.h2`
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.large};
  margin-bottom: ${theme.padding.medium};
  text-align: center;
`;

const DashboardPage: React.FC = () => {
  const { activeHousehold } = useHouseholds();

  const getHouseholdName = () => {
    if (!activeHousehold) return 'Sin hogar seleccionado';
    if (typeof activeHousehold === 'string') return activeHousehold;
    if (typeof activeHousehold === 'object' && 'name' in activeHousehold)
      return activeHousehold.name;
    return 'Hogar desconocido';
  };

  return (
    <HomeContainer>
      <Title>Dashboard de {getHouseholdName()}</Title>
      <Row>
        <Col xs={12} md={6}>
          <Section>
            <SectionTitle>Registrar Nuevo Gasto</SectionTitle>
            <ExpenseForm />
          </Section>
        </Col>
        <Col xs={12} md={6}>
          <Section>
            <SectionTitle>Distribución de gastos por categoría</SectionTitle>
            <MonthlyExpensesChart />
          </Section>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Section>
            <SectionTitle>Gastos Recientes</SectionTitle>
            {/* Comenta o elimina la siguiente línea si RecentExpenses no existe */}
            {/* <RecentExpenses /> */}
          </Section>
        </Col>
      </Row>
    </HomeContainer>
  );
};

export default DashboardPage;
