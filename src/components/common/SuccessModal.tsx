// src/components/common/SuccessModal.tsx
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { FaCheckCircle } from 'react-icons/fa';
import { theme } from '../../styles/theme';

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
  max-width: 90%;
  width: 400px;
`;

const IconContainer = styled.div`
  color: ${theme.colors.success};
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  color: ${theme.colors.text};
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const ExpenseDetails = styled.div`
  background-color: ${theme.colors.backgroundLight};
  padding: 1rem;
  border-radius: ${theme.borderRadius};
  margin-bottom: 1rem;
`;

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: {
    description: string;
    amount: number;
    category: string;
    subcategory: string;
    date: string;
  };
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, expense }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <IconContainer>
          <FaCheckCircle />
        </IconContainer>
        <Message>Gasto registrado con éxito</Message>
        <ExpenseDetails>
          <p><strong>Descripción:</strong> {expense.description}</p>
          <p><strong>Monto:</strong> ${expense.amount.toFixed(2)}</p>
          <p><strong>Categoría:</strong> {expense.category}</p>
          <p><strong>Subcategoría:</strong> {expense.subcategory}</p>
          <p><strong>Fecha:</strong> {expense.date}</p>
        </ExpenseDetails>
      </ModalContent>
    </ModalOverlay>
  );
};

export default SuccessModal;