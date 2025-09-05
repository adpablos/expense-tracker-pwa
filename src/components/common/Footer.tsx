// src/components/common/Footer.tsx

import React from 'react';
import styledComponents from 'styled-components';

const FooterContainer = styledComponents.footer`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  color: ${({ theme }) => theme.colors.textLight};
  padding: ${({ theme }) => theme.padding.medium} 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const FooterContent = styledComponents.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const Copyright = styledComponents.p`
  margin: 0;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <Copyright>&copy; 2024 Expense Tracker. Todos los derechos reservados.</Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
