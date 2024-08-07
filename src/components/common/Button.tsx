import React from 'react';
// eslint-disable-next-line import/no-named-as-default
import styled, { css } from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isActive?: boolean;
  isRound?: boolean;
  fullWidth?: boolean;
}

const ButtonBase = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};

  ${({ isRound }) =>
    isRound
      ? css`
          border-radius: 50%;
        `
      : css`
          border-radius: ${({ theme }) => theme.borderRadius.medium};
        `}

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonVariants = {
  primary: css<ButtonProps>`
    background-color: ${({ theme, isActive }) =>
      isActive ? theme.colors.primaryHover : theme.colors.primary};
    color: ${({ theme }) => theme.colors.backgroundLight};
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.primaryHover};
    }
  `,
  secondary: css<ButtonProps>`
    background-color: ${({ theme, isActive }) =>
      isActive ? theme.colors.secondaryHover : theme.colors.secondary};
    color: ${({ theme }) => theme.colors.backgroundLight};
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.secondaryHover};
    }
  `,
  success: css<ButtonProps>`
    background-color: ${({ theme, isActive }) =>
      isActive ? theme.colors.successHover : theme.colors.success};
    color: ${({ theme }) => theme.colors.backgroundLight};
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.successHover};
    }
  `,
  danger: css<ButtonProps>`
    background-color: ${({ theme, isActive }) =>
      isActive ? theme.colors.dangerHover : theme.colors.danger};
    color: ${({ theme }) => theme.colors.backgroundLight};
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.dangerHover};
    }
  `,
  warning: css<ButtonProps>`
    background-color: ${({ theme, isActive }) =>
      isActive ? theme.colors.warningHover : theme.colors.warning};
    color: ${({ theme }) => theme.colors.textDark};
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.warningHover};
    }
  `,
};

const ButtonSizes = {
  small: css<ButtonProps>`
    font-size: ${({ theme }) => theme.fontSizes.small};
    padding: ${({ theme, isRound }) =>
      isRound ? theme.space.xsmall : `${theme.space.xxsmall} ${theme.space.xsmall}`};
    ${({ isRound }) =>
      isRound &&
      css`
        width: 30px;
        height: 30px;
      `}
  `,
  medium: css<ButtonProps>`
    font-size: ${({ theme }) => theme.fontSizes.medium};
    padding: ${({ theme, isRound }) =>
      isRound ? theme.space.small : `${theme.space.xsmall} ${theme.space.small}`};
    ${({ isRound }) =>
      isRound &&
      css`
        width: 40px;
        height: 40px;
      `}
  `,
  large: css<ButtonProps>`
    font-size: ${({ theme }) => theme.fontSizes.large};
    padding: ${({ theme, isRound }) =>
      isRound ? theme.space.medium : `${theme.space.small} ${theme.space.medium}`};
    ${({ isRound }) =>
      isRound &&
      css`
        width: 50px;
        height: 50px;
      `}
  `,
};

const StyledButton = styled(ButtonBase)<ButtonProps>`
  ${({ variant = 'primary' }) => ButtonVariants[variant]}
  ${({ size = 'medium' }) => ButtonSizes[size]}
  
  &:hover:not(:disabled) {
    transform: scale(1.05);
  }
`;

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};

export default Button;
