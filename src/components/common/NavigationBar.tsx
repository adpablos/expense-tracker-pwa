import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaPlus, FaList } from 'react-icons/fa';

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
        <FaHome /> Home
      </StyledNavLink>
      <StyledNavLink to="/add">
        <FaPlus /> Add Expense
      </StyledNavLink>
      <StyledNavLink to="/list">
        <FaList /> View Expenses
      </StyledNavLink>
    </Navigation>
  );
};

export default NavigationBar;