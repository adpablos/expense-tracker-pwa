import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { getUser, register } from '../services/api';
import { AppDispatch } from '../store';
import { setAuthInfo } from '../store/slices/authSlice';

import ErrorModal from './common/ErrorModal';

interface ApiError {
  response?: {
    status: number;
    data?: {
      message?: string;
    };
  };
  message: string;
}

const AuthCallback: React.FC = () => {
  const { isAuthenticated, getIdTokenClaims, error, getAccessTokenSilently, logout } = useAuth0();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthentication = async () => {
      if (error) {
        setModalError(`Error durante la autenticación: ${error.message}`);
        return;
      }

      if (isAuthenticated) {
        try {
          const user = await getIdTokenClaims();
          const accessToken = await getAccessTokenSilently();

          if (user) {
            localStorage.setItem('auth_token', accessToken);

            try {
              // Intentamos obtener la información del usuario
              const existingUser = await getUser();
              console.log('Usuario existente en nuestra API');

              // Si el usuario no existe, lo registramos
              if (!existingUser) {
                await register({
                  auth_provider_id: user.sub,
                  name: user.name || '',
                  email: user.email || '',
                });
                console.log('Usuario registrado exitosamente en nuestra API');
              }
            } catch (error) {
              const apiError = error as ApiError;
              console.error('Error al obtener/registrar usuario en nuestra API:', apiError);
              setModalError(`Error al procesar el usuario en nuestro sistema: ${apiError.message}`);
              return;
            }

            await dispatch(
              setAuthInfo({
                user: {
                  id: user.sub || '',
                  name: user.name || '',
                  email: user.email || '',
                },
                token: accessToken,
              })
            ).unwrap();
            navigate('/dashboard');
          }
        } catch (error) {
          const authError = error as Error;
          setModalError(
            `Error al establecer la información de autenticación: ${authError.message}`
          );
          console.error('Error al establecer la información de autenticación:', authError);
          // Logout the user if there's an error
          logout({ logoutParams: { returnTo: window.location.origin } });
        }
      }
    };

    handleAuthentication();
  }, [
    isAuthenticated,
    getIdTokenClaims,
    dispatch,
    navigate,
    error,
    getAccessTokenSilently,
    logout,
  ]);

  const closeModal = () => {
    setModalError(null);
    // Logout the user and redirect to home page
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <div>
      <div>Processing authentication...</div>
      {modalError && (
        <ErrorModal
          isOpen={!!modalError}
          onClose={closeModal}
          message={modalError}
          title="Authentication Error"
        />
      )}
    </div>
  );
};

export default AuthCallback;
