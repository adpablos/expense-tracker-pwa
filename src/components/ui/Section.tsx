import React from 'react';
import styledComponents from 'styled-components';

interface SectionProps {
  title?: string;
  children: React.ReactNode;
}

const SectionRoot = styledComponents.section`
  margin-bottom: ${({ theme }) => theme.space.large};
`;

const SectionTitle = styledComponents.h2`
  font-size: ${({ theme }) => theme.fontSizes.large};
  margin: 0 0 ${({ theme }) => theme.space.small} 0;
  color: ${({ theme }) => theme.colors.text};
`;

export const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <SectionRoot>
      {title && <SectionTitle>{title}</SectionTitle>}
      {children}
    </SectionRoot>
  );
};

export default Section;
