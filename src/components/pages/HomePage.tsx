import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus, FaList } from 'react-icons/fa';
import RecentExpenses from '../expenses/RecentExpenses';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const WelcomeSection = styled.section`
  text-align: center;
  margin-bottom: 20px;
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const ActionButton = styled(Link)`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  svg {
    margin-right: 10px;
  }
`;

const HomePage: React.FC = () => {
  return (
    <HomeContainer>
      <WelcomeSection>
        <h2>Welcome to Your Expense Tracker</h2>
        <p>Manage your expenses easily and efficiently.</p>
      </WelcomeSection>
      
      <ActionButtonsContainer>
        <ActionButton to="/add">
          <FaPlus /> Add New Expense
        </ActionButton>
        <ActionButton to="/list">
          <FaList /> View All Expenses
        </ActionButton>
      </ActionButtonsContainer>
      
      <RecentExpenses />
    </HomeContainer>
  );
};

export default HomePage;