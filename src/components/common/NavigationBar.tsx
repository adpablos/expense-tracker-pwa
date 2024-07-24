import React from 'react';
import styled from 'styled-components';
import { FaHome } from 'react-icons/fa';
import { theme } from '../../styles/theme';

const NavBar = styled.nav`
  display: flex;
  justify-content: center;
  padding: 1rem;
  background-color: ${theme.colors.backgroundLight};
  margin-bottom: 1rem;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.primary};
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.3s ease;

  &:hover {
    color: ${theme.colors.primaryHover};
  }
`;

interface NavigationBarProps {
  onHome: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ onHome }) => (
  <NavBar>
    <NavButton onClick={onHome} aria-label="Volver al inicio">
      <FaHome />
    </NavButton>
  </NavBar>
);

export default NavigationBar;