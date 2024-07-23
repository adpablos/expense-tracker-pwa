// src/components/common/SubmitButton.tsx
import React from 'react';
import styled from 'styled-components';
import { FaCheck } from 'react-icons/fa';
import { theme } from '../../styles/theme';

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background-color: ${theme.colors.success};
  color: ${theme.colors.background};
  border: none;
  border-radius: ${theme.borderRadius};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${theme.colors.successHover};
  }

  &:disabled {
    background-color: ${theme.colors.disabled};
    cursor: not-allowed;
  }

  svg {
    margin-right: 0.5rem;
  }
`;

export interface SubmitButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick, disabled, children }) => (
  <Button onClick={onClick} disabled={disabled}>
    <FaCheck /> {children || 'Registrar gasto'}
  </Button>
);

export default SubmitButton;