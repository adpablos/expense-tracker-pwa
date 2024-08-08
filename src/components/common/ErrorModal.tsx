/* eslint-disable import/no-named-as-default */
import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import styled from 'styled-components';

import { theme } from '../../styles/theme';

import Button from './Button';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${theme.colors.background};
  padding: 2rem;
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.large};
  text-align: center;
  max-width: 90%;
  width: 400px;
`;

const IconContainer = styled.div`
  color: ${theme.colors.error};
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ErrorTitle = styled.h3`
  color: ${theme.colors.error};
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
`;

const ErrorMessage = styled.p`
  color: ${theme.colors.text};
  font-size: 1rem;
  margin-bottom: 1.5rem;
`;

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <IconContainer>
          <FaExclamationTriangle />
        </IconContainer>
        <ErrorTitle>Error al procesar el gasto</ErrorTitle>
        <ErrorMessage>{message}</ErrorMessage>
        <Button variant="primary" onClick={onClose}>
          Cerrar
        </Button>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ErrorModal;
