// src/components/common/Footer.tsx

import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.padding.medium} 0;
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const Copyright = styled.p`
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
