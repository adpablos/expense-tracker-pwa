import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { register } from '../services/api';
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
  const { isAuthenticated, getIdTokenClaims, error, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthentication = async () => {
      if (error) {
        setModalError(`Error during authentication: ${error.message}`);
        return;
      }

      if (isAuthenticated) {
        try {
          const user = await getIdTokenClaims();
          const accessToken = await getAccessTokenSilently();

          if (user) {
            localStorage.setItem('auth_token', accessToken);

            try {
              await register({
                auth_provider_id: user.sub,
                name: user.name || '',
                email: user.email || '',
              });
              console.log('User registered successfully in our API');
            } catch (error) {
              const apiError = error as ApiError;
              if (axios.isAxiosError(apiError) && apiError.response?.status === 409) {
                console.log('User already exists in our API');
                // El usuario ya existe, podemos continuar con el flujo normal
              } else {
                console.error('Error registering user in our API:', apiError);
                setModalError(`Error registering user in our system: ${apiError.message}`);
                return;
              }
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
          setModalError(`Error setting authentication information: ${authError.message}`);
          console.error('Error setting auth info:', authError);
        }
      }
    };

    handleAuthentication();
  }, [isAuthenticated, getIdTokenClaims, dispatch, navigate, error, getAccessTokenSilently]);

  const closeModal = () => {
    setModalError(null);
    navigate('/');
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
