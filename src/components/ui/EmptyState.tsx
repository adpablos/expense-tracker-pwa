import React from 'react';
import styledComponents from 'styled-components';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const Root = styledComponents.div`
  text-align: center;
  padding: ${({ theme }) => theme.space.large};
  color: ${({ theme }) => theme.colors.textLight};
`;

const Title = styledComponents.h3`
  margin: 0 0 ${({ theme }) => theme.space.small} 0;
  color: ${({ theme }) => theme.colors.text};
`;

const Description = styledComponents.p`
  margin: 0 0 ${({ theme }) => theme.space.medium} 0;
`;

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action }) => {
  return (
    <Root>
      <Title>{title}</Title>
      {description && <Description>{description}</Description>}
      {action}
    </Root>
  );
};

export default EmptyState;
