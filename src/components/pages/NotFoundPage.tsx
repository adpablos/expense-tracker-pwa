import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 140px);
  text-align: center;
  padding: ${({ theme }) => theme.padding.large};
  background-color: ${({ theme }) => theme.colors.backgroundLight};
`;

const NotFoundContent = styled.div`
  max-width: 600px;
  width: 100%;
`;

const NotFoundImage = styled.img`
  width: 100%;
  max-width: 300px;
  margin-bottom: ${({ theme }) => theme.space.large};
`;

const NotFoundTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.space.medium};
`;

const NotFoundText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  margin-bottom: ${({ theme }) => theme.space.large};
  color: ${({ theme }) => theme.colors.textLight};
`;

const HomeLink = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.backgroundLight};
  text-decoration: none;
  padding: ${({ theme }) => theme.padding.small} ${({ theme }) => theme.padding.medium};
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

const NotFoundPage: React.FC = () => {
  return (
    <NotFoundContainer>
      <NotFoundContent>
        <NotFoundImage src="/images/404.jpg" alt="Hucha confundida" />
        <NotFoundTitle>¡Ups! Parece que nos hemos perdido</NotFoundTitle>
        <NotFoundText>
          Esta página se ha esfumado como el dinero a fin de mes. ¿Quizás se fue de compras?
        </NotFoundText>
        <HomeLink to="/">Volver a terreno conocido</HomeLink>
      </NotFoundContent>
    </NotFoundContainer>
  );
};

export default NotFoundPage;
