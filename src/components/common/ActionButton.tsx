// src/components/common/ActionButton.tsx
import React from 'react';
// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components';

import { theme } from '../../styles/theme';

const Button = styled.button<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background-color: ${(props) => (props.isActive ? theme.colors.error : theme.colors.primary)};
  color: ${theme.colors.backgroundLight};
  font-size: ${theme.fontSizes.large};
  cursor: pointer;
  transition: all ${theme.transitions.default};

  &:hover {
    transform: scale(1.05);
    background-color: ${(props) =>
      props.isActive ? theme.colors.error : theme.colors.primaryHover};
  }

  &:disabled {
    background-color: ${theme.colors.disabled};
    cursor: not-allowed;
  }
`;

interface ActionButtonProps {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, isActive, children }) => (
  <Button onClick={onClick} isActive={isActive}>
    {children}
  </Button>
);

export default ActionButton;
