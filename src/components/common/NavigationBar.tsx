/* eslint-disable import/no-named-as-default */
import { useAuth0 } from '@auth0/auth0-react';
import React, { useState, useEffect } from 'react';
import {
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChartBar,
  FaTags,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import logo from '../../assets/logo.svg';

import Button from './Button';

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.padding.medium};
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  box-shadow: ${({ theme }) => theme.shadows.small};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
`;

const LogoImage = styled.img`
  height: 40px;
`;

const NavItems = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.medium};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({ theme }) => theme.colors.backgroundLight};
    transition: transform 0.3s ease-in-out;
    transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(-100%)')};
    padding: ${({ theme }) => theme.padding.medium};
    overflow-y: auto;
    z-index: 1000;
  }
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  padding: ${({ theme }) => theme.padding.small};
  margin: 0 ${({ theme }) => theme.space.small};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
    text-align: center;
    padding: ${({ theme }) => theme.padding.medium};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.medium};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    width: 100%;
  }
`;

const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1001;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
  }
`;

const NavigationBar: React.FC = () => {
  const { isAuthenticated, isLoading, loginWithRedirect, logout, error } = useAuth0();
  const [isOpen, setIsOpen] = useState(false);
  const [authState, setAuthState] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setAuthState(isAuthenticated);
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    if (error) {
      console.error('Auth0 error:', error);
      setAuthState(false);
    }
  }, [error]);

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
    setAuthState(false);
  };

  const handleLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        ui_locales: 'es',
      },
    });
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  if (isLoading) {
    return <Nav>Cargando...</Nav>;
  }

  return (
    <Nav>
      <Logo to="/">
        <LogoImage src={logo} alt="Expense Tracker" />
      </Logo>
      <HamburgerButton onClick={toggleMenu}>{isOpen ? <FaTimes /> : <FaBars />}</HamburgerButton>
      <NavItems $isOpen={isOpen}>
        {authState ? (
          <>
            <NavLink to="/dashboard" onClick={() => setIsOpen(false)}>
              <FaChartBar /> Dashboard
            </NavLink>
            <NavLink to="/list" onClick={() => setIsOpen(false)}>
              <FaChartBar /> Ver Gastos
            </NavLink>
            <NavLink to="/categories" onClick={() => setIsOpen(false)}>
              <FaTags /> Categorías
            </NavLink>
            <Button onClick={handleLogout} variant="secondary">
              <FaSignOutAlt /> <span style={{ marginLeft: '0.5em' }}>Cerrar sesión</span>
            </Button>
          </>
        ) : (
          <ButtonContainer>
            <Button onClick={() => handleLogin()} variant="secondary">
              <FaSignInAlt /> <span style={{ marginLeft: '0.5em' }}>Iniciar sesión</span>
            </Button>
            <Button
              onClick={() =>
                loginWithRedirect({
                  authorizationParams: {
                    screen_hint: 'signup',
                  },
                })
              }
              variant="primary"
            >
              <FaUserPlus /> <span style={{ marginLeft: '0.5em' }}>Registrarse</span>
            </Button>
          </ButtonContainer>
        )}
      </NavItems>
    </Nav>
  );
};

export default NavigationBar;
