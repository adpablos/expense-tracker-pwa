import React from 'react';
import { FaChartBar, FaListUl, FaTags, FaCog } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import styledComponents from 'styled-components';

const SidebarRoot = styledComponents.aside`
  position: sticky;
  top: 0;
  height: 100vh;
  width: 280px;
  padding: ${({ theme }) => theme.space.medium};
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.small};
  display: none;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.large};
  z-index: ${({ theme }) => theme.zIndices.sticky};

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    display: flex;
  }
`;

const Brand = styledComponents.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.small};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.large};
`;

const NavGroup = styledComponents.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xsmall};
`;

const Item = styledComponents(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.small};
  padding: 0.625rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  transition: background-color ${({ theme }) => theme.transitions.default},
    color ${({ theme }) => theme.transitions.default};

  &.active {
    background: ${({ theme }) => theme.colors.primary}20;
    color: ${({ theme }) => theme.colors.primary};
  }

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

const Footer = styledComponents.div`
  margin-top: auto;
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.textLight};
`;

export const Sidebar: React.FC = () => {
  return (
    <SidebarRoot>
      <Brand>
        <span>💸</span>
        <span>Expenses</span>
      </Brand>

      <NavGroup>
        <Item to="/dashboard">
          <FaChartBar />
          <span>Dashboard</span>
        </Item>
        <Item to="/expenses">
          <FaListUl />
          <span>Gastos</span>
        </Item>
        <Item to="/categories">
          <FaTags />
          <span>Categorías</span>
        </Item>
        <Item to="/settings">
          <FaCog />
          <span>Ajustes</span>
        </Item>
      </NavGroup>

      <Footer>v1.0 — Tu dinero, bajo control</Footer>
    </SidebarRoot>
  );
};

export default Sidebar;
