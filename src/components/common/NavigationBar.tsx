// src/components/common/NavigationBar.tsx
import React from 'react';
import { FaHome, FaList, FaTags } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components';

const Navigation = styled.nav`
  display: flex;
  gap: 10px;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 10px;
  color: #007bff;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f0f0f0;
  }

  &.active {
    color: #0056b3;
    font-weight: bold;
  }

  svg {
    margin-right: 5px;
  }
`;

const NavigationBar: React.FC = () => {
  return (
    <Navigation>
      <StyledNavLink to="/" end>
        <FaHome /> Inicio
      </StyledNavLink>
      <StyledNavLink to="/list">
        <FaList /> Ver Gastos
      </StyledNavLink>
      <StyledNavLink to="/categories">
        <FaTags /> Categorías
      </StyledNavLink>
    </Navigation>
  );
};

export default NavigationBar;
