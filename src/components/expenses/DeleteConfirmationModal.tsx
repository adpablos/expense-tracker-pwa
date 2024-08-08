import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components';

import { Expense } from '../../types';
// eslint-disable-next-line import/no-named-as-default
import Button from '../common/Button';

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
  background-color: ${({ theme }) => theme.colors.background};
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  text-align: center;
  max-width: 400px;
`;

const Icon = styled(FaExclamationTriangle)`
  color: ${({ theme }) => theme.colors.warning};
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
`;

const Message = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 1.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
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
  onCancel,
}) => {
  if (!isOpen || !expense) return null;

  return (
    <ModalOverlay onClick={onCancel}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Icon />
        <Title>Confirmar eliminación</Title>
        <Message>
          ¿Estás seguro de que quieres eliminar el gasto &ldquo;
          {expense.description}&ldquo;?
        </Message>
        <ButtonContainer>
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Eliminar
          </Button>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default DeleteConfirmationModal;
