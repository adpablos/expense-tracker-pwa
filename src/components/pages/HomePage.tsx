import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus, FaList } from 'react-icons/fa';
import RecentExpenses from '../expenses/RecentExpenses';
import { theme } from '../../styles/theme';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.padding.large};
  padding: ${theme.padding.medium};
`;

const WelcomeSection = styled.section`
  text-align: center;
  margin-bottom: ${theme.padding.large};
`;

const Title = styled.h1`
  color: ${theme.colors.primary};
  font-size: ${theme.fontSize.large};
  margin-bottom: ${theme.padding.small};
`;

const Subtitle = styled.p`
  color: ${theme.colors.textLight};
  font-size: ${theme.fontSize.medium};
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.padding.medium};
`;

const ActionButton = styled(Link)`
  display: flex;
  align-items: center;
  padding: ${theme.padding.small} ${theme.padding.medium};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.background};
  text-decoration: none;
  border-radius: ${theme.borderRadius};
  transition: background-color ${theme.transition};
  font-size: ${theme.fontSize.medium};

  &:hover {
    background-color: ${theme.colors.primaryHover};
  }

  svg {
    margin-right: ${theme.padding.small};
  }
`;

const RecentExpensesSection = styled.section`
  margin-top: ${theme.padding.large};
`;

const SectionTitle = styled.h2`
  color: ${theme.colors.text};
  font-size: ${theme.fontSize.large};
  margin-bottom: ${theme.padding.medium};
  text-align: center;
`;

const HomePage: React.FC = () => {
  return (
    <HomeContainer>
      <WelcomeSection>
        <Title>Bienvenido a tu Gestor de Gastos</Title>
        <Subtitle>Gestiona tus gastos de forma fácil y eficiente.</Subtitle>
      </WelcomeSection>
      
      <ActionButtonsContainer>
        <ActionButton to="/add">
          <FaPlus /> Añadir Nuevo Gasto
        </ActionButton>
        <ActionButton to="/list">
          <FaList /> Ver Todos los Gastos
        </ActionButton>
      </ActionButtonsContainer>
      
      <RecentExpensesSection>
        <SectionTitle>Gastos Recientes</SectionTitle>
        <RecentExpenses />
      </RecentExpensesSection>
    </HomeContainer>
  );
};

export default HomePage;