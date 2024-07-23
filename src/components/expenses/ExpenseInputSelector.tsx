// src/components/expenses/ExpenseInputSelector.tsx
import React from 'react';
import styled from 'styled-components';
import { FaFileAlt, FaMicrophone, FaImage } from 'react-icons/fa';
import { theme } from '../../styles/theme';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: ${theme.colors.text};
  margin-bottom: 2rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const MethodButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  border: none;
  border-radius: ${theme.borderRadius};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.background};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${theme.colors.primaryHover};
  }

  svg {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
  }
`;

export type InputMethod = 'manual' | 'audio' | 'image';

interface ExpenseInputSelectorProps {
  onSelectMethod: (method: InputMethod) => void;
}

const ExpenseInputSelector: React.FC<ExpenseInputSelectorProps> = ({ onSelectMethod }) => (
  <Container>
    <Title>Registrar nuevo gasto</Title>
    <ButtonContainer>
      <MethodButton onClick={() => onSelectMethod('manual')}>
        <FaFileAlt />
        Rellenar formulario
      </MethodButton>
      <MethodButton onClick={() => onSelectMethod('audio')}>
        <FaMicrophone />
        Grabar descripción
      </MethodButton>
      <MethodButton onClick={() => onSelectMethod('image')}>
        <FaImage />
        Subir recibo
      </MethodButton>
    </ButtonContainer>
  </Container>
);

export default ExpenseInputSelector;