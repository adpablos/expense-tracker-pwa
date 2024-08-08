import React from 'react';
import { FaSpinner } from 'react-icons/fa';
// eslint-disable-next-line import/no-named-as-default
import styled, { keyframes } from 'styled-components';

import { theme } from '../../styles/theme';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Spinner = styled(FaSpinner)`
  font-size: 3rem;
  color: ${theme.colors.background};
  animation: ${spin} 1s linear infinite;
`;

const Message = styled.p`
  color: ${theme.colors.background};
  margin-top: 1rem;
  font-size: 1.2rem;
`;

interface LoadingOverlayProps {
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = 'Procesando...' }) => (
  <Overlay>
    <Spinner />
    <Message>{message}</Message>
  </Overlay>
);

export default LoadingOverlay;
