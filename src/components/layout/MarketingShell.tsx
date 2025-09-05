import React from 'react';
import styled from 'styled-components';

import Footer from '../common/Footer';
import NavigationBar from '../common/NavigationBar';

interface MarketingShellProps {
  children: React.ReactNode;
}

const MarketingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(1000px 400px at 20% -200px, rgba(99, 102, 241, 0.06), transparent),
    radial-gradient(800px 300px at 80% -100px, rgba(6, 182, 212, 0.06), transparent);
`;

const MarketingContent = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

export const MarketingShell: React.FC<MarketingShellProps> = ({ children }) => {
  return (
    <MarketingContainer>
      <NavigationBar />
      <MarketingContent>{children}</MarketingContent>
      <Footer />
    </MarketingContainer>
  );
};

export default MarketingShell;
