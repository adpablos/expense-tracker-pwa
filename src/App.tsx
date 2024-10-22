/* eslint-disable import/no-named-as-default */
import { Auth0Provider } from '@auth0/auth0-react';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';

import AuthCallback from './components/AuthCallback';
import Footer from './components/common/Footer';
import NavigationBar from './components/common/NavigationBar';
import CompleteRegistration from './components/CompleteRegistration';
import DataProvider from './components/DataProvider';
import ExpenseList from './components/expenses/ExpenseList';
import CategoriesPage from './components/pages/CategoriesPage';
import DashboardPage from './components/pages/DashboardPage';
import HomePage from './components/pages/HomePage';
import NotFoundPage from './components/pages/NotFoundPage';
import SettingsPage from './components/pages/SettingsPage';
import PrivateRoute from './components/PrivateRoute';
import { HouseholdProvider } from './contexts/HouseholdContext';
import GlobalStyle from './styles/globalStyles';
import { theme } from './styles/theme';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.padding.medium};
  margin-top: 70px; // Añadimos un margen superior global
`;

const App: React.FC = () => {
  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN!}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID!}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/callback`,
        audience: 'https://api.expensetracker.com',
        ui_locales: 'es',
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <ThemeProvider theme={theme}>
        <DataProvider>
          <HouseholdProvider>
            <Router>
              <GlobalStyle />
              <AppContainer>
                <NavigationBar />
                <MainContent>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route
                      path="/expenses"
                      element={
                        <PrivateRoute>
                          <ExpenseList />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/categories"
                      element={
                        <PrivateRoute>
                          <CategoriesPage />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <PrivateRoute>
                          <SettingsPage />
                        </PrivateRoute>
                      }
                    />
                    <Route path="/callback" element={<AuthCallback />} />
                    <Route
                      path="/dashboard"
                      element={
                        <PrivateRoute>
                          <DashboardPage />
                        </PrivateRoute>
                      }
                    />
                    <Route path="/complete-registration" element={<CompleteRegistration />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </MainContent>
                <Footer />
              </AppContainer>
            </Router>
          </HouseholdProvider>
        </DataProvider>
      </ThemeProvider>
    </Auth0Provider>
  );
};

export default App;
