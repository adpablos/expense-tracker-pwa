import React from 'react';
import styledComponents from 'styled-components';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const CardRoot = styledComponents.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.small};
  padding: ${({ theme }) => theme.padding.medium};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: transform ${({ theme }) => theme.transitions.default}, box-shadow ${({ theme }) => theme.transitions.default};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return <CardRoot className={className}>{children}</CardRoot>;
};

export default Card;
