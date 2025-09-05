import React from 'react';
import styledComponents from 'styled-components';

import Footer from '../common/Footer';
import NavigationBar from '../common/NavigationBar';

import BottomNav from './BottomNav';
import Sidebar from './Sidebar';

const Shell = styledComponents.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(1000px 400px at 20% -200px, rgba(12, 123, 255, 0.06), transparent),
    radial-gradient(800px 300px at 80% -100px, rgba(6, 182, 212, 0.06), transparent);
`;

const Content = styledComponents.div`
  flex: 1;
  display: flex;
  gap: ${({ theme }) => theme.space.large};
  padding: ${({ theme }) => theme.space.large} ${({ theme }) => theme.space.medium};
`;

const Main = styledComponents.main`
  flex: 1;
  min-width: 0;
  margin-top: 70px;
`;

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <Shell>
      <NavigationBar />
      <Content>
        <Sidebar />
        <Main>{children}</Main>
      </Content>
      <Footer />
      <BottomNav />
    </Shell>
  );
};

export default AppShell;
