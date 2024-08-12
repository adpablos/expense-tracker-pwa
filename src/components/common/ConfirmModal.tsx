/* eslint-disable import/no-named-as-default */
import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import styled from 'styled-components';

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
  padding: ${({ theme }) => theme.space.large};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: ${({ theme }) => theme.space.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.warning};
`;

const Message = styled.p`
  margin-bottom: ${({ theme }) => theme.space.large};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.space.small};
`;
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Title>
          <FaExclamationTriangle style={{ marginRight: '0.5rem' }} /> Confirmar acción
        </Title>
        <Message>{message}</Message>
        <ButtonGroup>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Confirmar
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ConfirmModal;
