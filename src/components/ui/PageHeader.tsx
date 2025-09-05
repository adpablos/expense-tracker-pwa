import React from 'react';
import styledComponents from 'styled-components';

import { Stack as StackLayout } from './Stack';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const Title = styledComponents.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  color: ${({ theme }) => theme.colors.text};
`;

const Subtitle = styledComponents.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textLight};
`;

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions }) => {
  return (
    <StackLayout direction="row" justify="space-between" align="center">
      <div>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </div>
      {actions}
    </StackLayout>
  );
};

export default PageHeader;
