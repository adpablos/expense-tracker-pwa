/* eslint-disable import/no-named-as-default */
import React from 'react';
import styledComponents from 'styled-components';

import { useHouseholds } from '../../hooks/useHouseholds';
// theme imported via styled theme in styled-components props
import ExpenseForm from '../expenses/ExpenseForm';
import MonthlyExpensesChart from '../expenses/MonthlyExpensesChart';
import { Col, Row } from '../layout/Grid';
import Container from '../ui/Container';
import PageHeader from '../ui/PageHeader';

// Importa el componente RecentExpenses si existe
// import RecentExpenses from '../expenses/RecentExpenses';

const HomeContainer = styledComponents(Container)`
  padding-top: ${({ theme }) => theme.padding.large};
  padding-bottom: ${({ theme }) => theme.padding.large};
`;

const TitleSpacer = styledComponents.div`
  margin-bottom: ${({ theme }) => theme.padding.large};
`;

const SectionCard = styledComponents.section`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.padding.medium};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  height: 100%;
`;

const SectionTitle = styledComponents.h2`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.large};
  margin-bottom: ${({ theme }) => theme.padding.medium};
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
      <TitleSpacer>
        <PageHeader
          title={`Resumen de ${getHouseholdName()}`}
          subtitle="Una vista clara de tus hábitos de gasto"
        />
      </TitleSpacer>
      <Row>
        <Col xs={12} md={6}>
          <SectionCard>
            <SectionTitle>Nuevo gasto</SectionTitle>
            <ExpenseForm />
          </SectionCard>
        </Col>
        <Col xs={12} md={6}>
          <SectionCard>
            <SectionTitle>Gastos por categoría</SectionTitle>
            <MonthlyExpensesChart />
          </SectionCard>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <SectionCard>
            <SectionTitle>Gastos Recientes</SectionTitle>
            {/* Comenta o elimina la siguiente línea si RecentExpenses no existe */}
            {/* <RecentExpenses /> */}
          </SectionCard>
        </Col>
      </Row>
    </HomeContainer>
  );
};

export default DashboardPage;
