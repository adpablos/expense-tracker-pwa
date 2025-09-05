/* eslint-disable import/no-named-as-default */
import { useAuth0 } from '@auth0/auth0-react';
import React, { useState, useRef, useEffect } from 'react';
import { FaChartBar, FaCog, FaUser, FaSignOutAlt, FaUserPlus, FaMoon, FaSun } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { ReactComponent as LogoSVG } from '../../assets/logo.svg';
import { useHouseholds } from '../../hooks/useHouseholds';

import Select from './Select';

const Nav = styled.nav`
  position: sticky;
  top: 0;
  backdrop-filter: saturate(180%) blur(10px);
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 0.75rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  z-index: ${({ theme }) => theme.zIndices.sticky};
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
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
  margin-left: 1.25rem;
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  transition:
    background-color ${({ theme }) => theme.transitions.default},
    color ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
  }

  svg {
    margin-right: 0.5rem;
  }
`;

const IconButton = styled.button`
  margin-left: 0.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: none;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.default};
  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

const UserMenu = styled.div`
  position: relative;
  margin-left: 1.5rem;
`;

const UserButton = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  transition: background-color ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
  }

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
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  min-width: 200px;
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.625rem 1rem;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
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
  padding: 0.625rem 1rem;
  color: ${({ theme }) => theme.colors.text};
  background: none;
  border: none;
  cursor: pointer;
  font-size: inherit;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
  }

  svg {
    margin-right: 0.5rem;
  }
`;

const AuthButton = styled.button<{ primary?: boolean }>`
  color: ${({ theme, primary }) => (primary ? theme.colors.white : theme.colors.primary)};
  background-color: ${({ theme, primary }) => (primary ? theme.colors.primary : 'transparent')};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  padding: 0.5rem 1rem;
  margin-left: 1rem;
  cursor: pointer;
  font-weight: bold;
  transition:
    background-color ${({ theme }) => theme.transitions.default},
    color ${({ theme }) => theme.transitions.default};
  display: inline-flex;
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
  const { households, activeHousehold, setActiveHousehold } = useHouseholds();
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('themeMode') as 'light' | 'dark' | null;
    if (stored) return stored;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

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

  const toggleTheme = () => {
    const next: 'light' | 'dark' = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    localStorage.setItem('themeMode', next);
    const evt = new CustomEvent('app:set-theme-mode', { detail: next });
    window.dispatchEvent(evt);
  };

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
            {households.length > 0 && (
              <div style={{ marginLeft: '1rem' }}>
                <Select
                  value={activeHousehold?.id || ''}
                  onChange={(e) => {
                    const h = households.find((hh) => hh.id === e.target.value) || null;
                    setActiveHousehold(h);
                  }}
                  options={households.map((h) => ({ value: h.id, label: h.name }))}
                  placeholder="Select household"
                />
              </div>
            )}
            <IconButton onClick={toggleTheme} aria-label="Toggle theme">
              {mode === 'dark' ? <FaSun /> : <FaMoon />}
            </IconButton>
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
            <IconButton onClick={toggleTheme} aria-label="Toggle theme">
              {mode === 'dark' ? <FaSun /> : <FaMoon />}
            </IconButton>
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
