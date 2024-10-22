/* eslint-disable import/no-named-as-default */
import { useAuth0 } from '@auth0/auth0-react';
import React, { useState, useRef, useEffect } from 'react';
import { FaChartBar, FaCog, FaUser, FaSignOutAlt, FaUserPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { ReactComponent as LogoSVG } from '../../assets/logo.svg';

const Nav = styled.nav`
  background-color: white;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  svg {
    height: 40px;
  }
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  margin-left: 1.5rem;
  display: flex;
  align-items: center;

  &:hover {
    text-decoration: underline;
  }

  svg {
    margin-right: 0.5rem;
  }
`;

const UserMenu = styled.div`
  position: relative;
  margin-left: 1.5rem;
`;

const UserButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  display: flex;
  align-items: center;

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 0.5rem;
  }
`;

const UserDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  right: 0;
  top: 100%;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  min-width: 200px;
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundLight};
  }

  svg {
    margin-right: 0.5rem;
  }
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  text-align: left;
  padding: 0.5rem 1rem;
  color: ${({ theme }) => theme.colors.text};
  background: none;
  border: none;
  cursor: pointer;
  font-size: inherit;

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundLight};
  }

  svg {
    margin-right: 0.5rem;
  }
`;

const AuthButton = styled.button<{ primary?: boolean }>`
  color: ${({ theme, primary }) => (primary ? theme.colors.white : theme.colors.primary)};
  background-color: ${({ theme, primary }) => (primary ? theme.colors.primary : 'transparent')};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 20px;
  padding: 0.5rem 1rem;
  margin-left: 1rem;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;

  &:hover {
    background-color: ${({ theme, primary }) =>
      primary ? theme.colors.primaryDark : theme.colors.primaryLight};
    color: ${({ theme, primary }) => (primary ? theme.colors.white : theme.colors.primaryDark)};
  }

  svg {
    margin-right: 0.5rem;
  }
`;

const NavigationBar: React.FC = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogin = () => loginWithRedirect();
  const handleSignUp = () =>
    loginWithRedirect({
      authorizationParams: { screen_hint: 'signup' },
    });

  return (
    <Nav>
      <NavContent>
        <Logo to="/">
          <LogoSVG />
        </Logo>
        {isAuthenticated ? (
          <NavItems>
            <NavLink to="/dashboard">
              <FaChartBar /> Dashboard
            </NavLink>
            <UserMenu ref={userMenuRef}>
              <UserButton onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                {user?.picture ? <img src={user.picture} alt={user.name || 'User'} /> : <FaUser />}
                {user?.name}
              </UserButton>
              <UserDropdown isOpen={isUserMenuOpen}>
                <DropdownItem to="/settings" onClick={() => setIsUserMenuOpen(false)}>
                  <FaCog /> Ajustes
                </DropdownItem>
                <DropdownButton
                  onClick={() => {
                    logout();
                    setIsUserMenuOpen(false);
                  }}
                >
                  <FaSignOutAlt /> Cerrar sesión
                </DropdownButton>
              </UserDropdown>
            </UserMenu>
          </NavItems>
        ) : (
          <NavItems>
            <AuthButton onClick={handleLogin}>
              <FaUser /> Iniciar sesión
            </AuthButton>
            <AuthButton primary onClick={handleSignUp}>
              <FaUserPlus /> Registrarse
            </AuthButton>
          </NavItems>
        )}
      </NavContent>
    </Nav>
  );
};

export default NavigationBar;
