import { Auth0Provider } from '@auth0/auth0-react';
import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import AuthCallback from './components/AuthCallback';
import CompleteRegistration from './components/CompleteRegistration';
import DataProvider from './components/DataProvider';
import ExpenseList from './components/expenses/ExpenseList';
import AppShellComponent from './components/layout/AppShell';
import MarketingShell from './components/layout/MarketingShell';
import CategoriesPage from './components/pages/CategoriesPage';
import DashboardPage from './components/pages/DashboardPage';
import HomePage from './components/pages/HomePage';
import NotFoundPage from './components/pages/NotFoundPage';
import SettingsPage from './components/pages/SettingsPage';
import PrivateRoute from './components/PrivateRoute';
import { HouseholdProvider } from './contexts/HouseholdContext';
import GlobalStyle from './styles/globalStyles';
import { darkTheme, theme } from './styles/theme';

const App: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(
    () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener('change', handler);

    const relay = (e: Event) => {
      const detail = (e as CustomEvent<'light' | 'dark'>).detail;
      setIsDark(detail === 'dark');
    };
    window.addEventListener('app:set-theme-mode', relay as EventListener);

    const stored = localStorage.getItem('themeMode');
    if (stored === 'light' || stored === 'dark') setIsDark(stored === 'dark');

    return () => {
      mq.removeEventListener('change', handler);
      window.removeEventListener('app:set-theme-mode', relay as EventListener);
    };
  }, []);

  const themed = useMemo(() => (isDark ? darkTheme : theme), [isDark]);

  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN!}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID!}
      authorizationParams={{
        redirect_uri: window.location.origin + '/callback',
        audience: process.env.REACT_APP_AUTH0_AUDIENCE!,
        scope: 'openid profile email offline_access',
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <ThemeProvider theme={themed}>
        <DataProvider>
          <HouseholdProvider>
            <Router>
              <GlobalStyle />
              <Routes>
                <Route
                  path="/"
                  element={
                    <MarketingShell>
                      <HomePage />
                    </MarketingShell>
                  }
                />
                <Route
                  path="/expenses"
                  element={
                    <PrivateRoute>
                      <AppShellComponent>
                        <ExpenseList />
                      </AppShellComponent>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/categories"
                  element={
                    <PrivateRoute>
                      <AppShellComponent>
                        <CategoriesPage />
                      </AppShellComponent>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <PrivateRoute>
                      <AppShellComponent>
                        <SettingsPage />
                      </AppShellComponent>
                    </PrivateRoute>
                  }
                />
                <Route path="/callback" element={<AuthCallback />} />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <AppShellComponent>
                        <DashboardPage />
                      </AppShellComponent>
                    </PrivateRoute>
                  }
                />
                <Route path="/complete-registration" element={<CompleteRegistration />} />
                <Route
                  path="*"
                  element={
                    <MarketingShell>
                      <NotFoundPage />
                    </MarketingShell>
                  }
                />
              </Routes>
            </Router>
          </HouseholdProvider>
        </DataProvider>
      </ThemeProvider>
    </Auth0Provider>
  );
};

export default App;
