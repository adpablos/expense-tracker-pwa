// src/components/PrivateRoute.tsx
import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import { useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const location = useLocation();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    loginWithRedirect({
      appState: { returnTo: location.pathname },
    });
    return null;
  }

  return <>{children}</>;
};

export default PrivateRoute;
