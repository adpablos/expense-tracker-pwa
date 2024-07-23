import React from 'react';
import styled from 'styled-components';
import { FaHome } from 'react-icons/fa';
import { theme } from '../../styles/theme';

const NavBar = styled.nav`
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
  background-color: ${theme.colors.backgroundLight};
  margin-bottom: 1rem;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.primary};
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: ${theme.colors.primaryHover};
  }
`;

interface NavigationBarProps {
  onHome: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ onHome }) => (
  <NavBar>
    <NavButton onClick={onHome}>
      <FaHome /> Inicio
    </NavButton>
  </NavBar>
);

export default NavigationBar;