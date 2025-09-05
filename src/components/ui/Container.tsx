import React from 'react';
import styledComponents from 'styled-components';

interface ContainerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  className?: string;
}

const sizes = {
  sm: '640px',
  md: '960px',
  lg: '1200px',
  xl: '1440px',
};

const ContainerRoot = styledComponents.div<{ size: NonNullable<ContainerProps['size']> }>`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: ${({ theme }) => theme.space.medium};
  padding-right: ${({ theme }) => theme.space.medium};
  max-width: ${({ size }) => sizes[size]};
`;

export const Container: React.FC<ContainerProps> = ({ size = 'lg', children, className }) => {
  return (
    <ContainerRoot size={size} className={className}>
      {children}
    </ContainerRoot>
  );
};

export default Container;
