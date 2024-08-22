/* eslint-disable import/no-named-as-default */
import React from 'react';
import styled from 'styled-components';

import { theme } from '../../styles/theme';
import ExpenseForm from '../expenses/ExpenseForm';
import MonthlyExpensesChart from '../expenses/MonthlyExpensesChart';
import { Col, Container, Row } from '../layout/Grid';

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
  return (
    <HomeContainer>
      <Title>Gestor de Gastos</Title>
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
    </HomeContainer>
  );
};

export default DashboardPage;
