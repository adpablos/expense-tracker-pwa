import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import NavigationBar from './components/common/NavigationBar';
import ExpenseForm from './components/expenses/ExpenseForm';
import ExpenseList from './components/expenses/ExpenseList';
import HomePage from './components/pages/HomePage';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
`;

const MainContent = styled.main`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const App: React.FC = () => {
  return (
    <Router>
      <AppContainer>
        <Header>
          <Title>Expense Tracker</Title>
          <NavigationBar />
        </Header>
        <MainContent>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add" element={<ExpenseForm />} />
            <Route path="/list" element={<ExpenseList />} />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
};

export default App;