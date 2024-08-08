import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// eslint-disable-next-line import/no-named-as-default
import styled, { ThemeProvider } from 'styled-components';

import NavigationBar from './components/common/NavigationBar';
import ExpenseForm from './components/expenses/ExpenseForm';
import ExpenseList from './components/expenses/ExpenseList';
import HomePage from './components/pages/HomePage';
import GlobalStyle from './styles/globalStyles';
import { theme } from './styles/theme';

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
    <ThemeProvider theme={theme}>
      <Router>
        <GlobalStyle />
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
    </ThemeProvider>
  );
};

export default App;
