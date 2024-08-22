/* eslint-disable import/no-named-as-default */
import { useAuth0 } from '@auth0/auth0-react';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { register } from '../services/api';
import { AppDispatch } from '../store'; // Asegúrate de que esta importación es correcta
import { setAuthInfo } from '../store/slices/authSlice';

import Button from './common/Button';
import ErrorModal from './common/ErrorModal';
import Input from './common/Input';

const Container = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.padding.large};
`;

const Title = styled.h2`
  text-align: center;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.space.large};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.medium};
`;

const CompleteRegistration: React.FC = () => {
  const { user } = useAuth0();
  const dispatch = useDispatch<AppDispatch>(); // Usar AppDispatch
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await register({
        auth_provider_id: user.sub!,
        name,
        email: user.email!,
      });

      const token = localStorage.getItem('auth_token');
      if (token) {
        await dispatch(
          setAuthInfo({
            user: {
              id: user.sub!,
              name,
              email: user.email!,
            },
            token,
          })
        );
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing registration:', error);
      setError('Failed to complete registration. Please try again.');
    }
  };

  return (
    <Container>
      <Title>Complete Your Registration</Title>
      <Form onSubmit={handleSubmit}>
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Button type="submit" variant="primary">
          Complete Registration
        </Button>
      </Form>
      {error && (
        <ErrorModal
          isOpen={!!error}
          onClose={() => setError(null)}
          message={error}
          title="Registration Error"
        />
      )}
    </Container>
  );
};

export default CompleteRegistration;
