import React from 'react';
import styled from 'styled-components';
import { FaExclamationTriangle } from 'react-icons/fa';
import { theme } from '../../styles/theme';
import { Expense } from '../../types';

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
  border-radius: ${theme.borderRadius};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
`;

const Icon = styled(FaExclamationTriangle)`
  color: ${theme.colors.warning};
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  color: ${theme.colors.text};
  margin-bottom: 1rem;
  text-align: center;
`;

const Message = styled.p`
  color: ${theme.colors.textLight};
  margin-bottom: 1.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const Button = styled.button<{ isPrimary?: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: ${theme.borderRadius};
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;

  background-color: ${props => props.isPrimary ? theme.colors.error : theme.colors.background};
  color: ${props => props.isPrimary ? theme.colors.background : theme.colors.text};
  border: 1px solid ${props => props.isPrimary ? theme.colors.error : theme.colors.border};

  &:hover {
    background-color: ${props => props.isPrimary ? theme.colors.errorHover : theme.colors.backgroundHover};
  }
`;

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  expense: Expense | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  expense,
  onConfirm,
  onCancel
}) => {
  if (!isOpen || !expense) return null;

  return (
    <ModalOverlay onClick={onCancel}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Icon />
        <Title>Confirmar eliminación</Title>
        <Message>¿Estás seguro de que quieres eliminar el gasto "{expense.description}"?</Message>
        <ButtonContainer>
          <Button onClick={onCancel}>Cancelar</Button>
          <Button isPrimary onClick={onConfirm}>Eliminar</Button>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default DeleteConfirmationModal;