import React from 'react';
// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.space.small};
`;

const StyledLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.small};
  margin-bottom: ${({ theme }) => theme.space.xxsmall};
  color: ${({ theme }) => theme.colors.text};
`;

const StyledInput = styled.input`
  padding: ${({ theme }) => theme.space.xsmall};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.disabled};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.small};
  margin-top: ${({ theme }) => theme.space.xxsmall};
`;

export const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <InputContainer>
      {label && <StyledLabel>{label}</StyledLabel>}
      <StyledInput {...props} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  );
};

export default Input;
