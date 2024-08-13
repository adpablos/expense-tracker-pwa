// src/components/common/MobileMenu.tsx
import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const MenuIcon = styled.div`
  display: none;
  cursor: pointer;
  font-size: 1.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
  }
`;

const MobileMenuContainer = styled.div<{ isOpen: boolean }>`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    background-color: ${({ theme }) => theme.colors.backgroundLight};
    padding: 1rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
`;

const MobileMenuItem = styled(NavLink)`
  padding: 0.5rem 0;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;

  &.active {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: bold;
  }
`;

const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <MenuIcon onClick={toggleMenu}>{isOpen ? <FaTimes /> : <FaBars />}</MenuIcon>
      <MobileMenuContainer isOpen={isOpen}>
        <MobileMenuItem to="/" onClick={toggleMenu}>
          Inicio
        </MobileMenuItem>
        <MobileMenuItem to="/list" onClick={toggleMenu}>
          Ver Gastos
        </MobileMenuItem>
        <MobileMenuItem to="/list" onClick={toggleMenu}>
          Categorías
        </MobileMenuItem>
        {/* Añadir más items de menú según sea necesario */}
      </MobileMenuContainer>
    </>
  );
};

export default MobileMenu;
