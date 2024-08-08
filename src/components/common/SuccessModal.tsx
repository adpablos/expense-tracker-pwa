import React from 'react';
import {
  FaCheckCircle,
  FaFileAlt,
  FaDollarSign,
  FaTag,
  FaLayerGroup,
  FaCalendarAlt,
  FaTimes,
} from 'react-icons/fa';
// eslint-disable-next-line import/no-named-as-default
import styled, { keyframes } from 'styled-components';

import { theme } from '../../styles/theme';
import { Expense } from '../../types';
import { formatDate } from '../../utils/expenseUtils';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${theme.colors.background};
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 90%;
  width: 400px;
  animation: ${fadeIn} 0.3s ease-out;
  position: relative; // Añadido para posicionar el botón de cierre
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: ${theme.colors.text};
  font-size: 1.5rem;
  cursor: pointer;
`;

const IconContainer = styled.div`
  color: ${theme.colors.success};
  font-size: 4rem;
  margin-bottom: 1.5rem;
`;

const Message = styled.h2`
  color: ${theme.colors.text};
  font-size: 1.5rem;
  margin-bottom: 2rem;
`;

const ExpenseDetails = styled.div`
  background-color: ${theme.colors.backgroundLight};
  padding: 1.5rem;
  border-radius: 10px;
  border: 1px solid ${theme.colors.border};
  text-align: left;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
  color: ${theme.colors.text};
  font-size: 1.1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailIcon = styled.span`
  color: ${theme.colors.primary};
  margin-right: 0.75rem;
  min-width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DetailLabel = styled.span`
  font-weight: bold;
  min-width: 120px;
  margin-right: 0.5rem;
`;

const DetailValue = styled.span`
  flex: 1;
`;

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: Expense | null;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, expense }) => {
  if (!isOpen || !expense) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
        <IconContainer>
          <FaCheckCircle />
        </IconContainer>
        <Message>Gasto registrado con éxito</Message>
        <ExpenseDetails>
          <DetailItem>
            <DetailIcon>
              <FaFileAlt />
            </DetailIcon>
            <DetailLabel>Descripción:</DetailLabel>
            <DetailValue>{expense.description}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailIcon>
              <FaDollarSign />
            </DetailIcon>
            <DetailLabel>Cantidad:</DetailLabel>
            <DetailValue>
              $
              {typeof expense.amount === 'string'
                ? parseFloat(expense.amount).toFixed(2)
                : expense.amount.toFixed(2)}
            </DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailIcon>
              <FaTag />
            </DetailIcon>
            <DetailLabel>Categoría:</DetailLabel>
            <DetailValue>{expense.category}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailIcon>
              <FaLayerGroup />
            </DetailIcon>
            <DetailLabel>Subcategoría:</DetailLabel>
            <DetailValue>{expense.subcategory}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailIcon>
              <FaCalendarAlt />
            </DetailIcon>
            <DetailLabel>Fecha:</DetailLabel>
            <DetailValue>{formatDate(expense.date)}</DetailValue>
          </DetailItem>
        </ExpenseDetails>
      </ModalContent>
    </ModalOverlay>
  );
};

export default SuccessModal;
