import React from 'react';
import { FaChartBar, FaListUl, FaTags, FaCog } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import styledComponents from 'styled-components';

const Bar = styledComponents.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: center;
  padding: 0 0.5rem;
  box-shadow: ${({ theme }) => theme.shadows.small};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    display: none;
  }
`;

const Item = styledComponents(NavLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  height: 100%;
  color: ${({ theme }) => theme.colors.textLight};
  text-decoration: none;
  
  &.active {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const BottomNav: React.FC = () => {
  return (
    <Bar>
      <Item to="/dashboard">
        <FaChartBar />
      </Item>
      <Item to="/expenses">
        <FaListUl />
      </Item>
      <Item to="/categories">
        <FaTags />
      </Item>
      <Item to="/settings">
        <FaCog />
      </Item>
    </Bar>
  );
};

export default BottomNav;
