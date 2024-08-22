/* eslint-disable import/no-named-as-default */
import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import { FaCamera, FaTags, FaCog } from 'react-icons/fa';
import styled from 'styled-components';

import Button from '../common/Button';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.padding.large};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.padding.medium};
  }
`;

const Hero = styled.section`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.space.xlarge};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.space.medium};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.xlarge};
  }
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: ${({ theme }) => theme.space.large};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.fontSizes.medium};
  }
`;

const FeaturesSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.space.large};
  margin-bottom: ${({ theme }) => theme.space.xlarge};
`;

const FeatureCard = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.padding.medium};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  text-align: center;
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.space.medium};
`;

const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.space.small};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
`;

const HowItWorksSection = styled.section`
  margin-bottom: ${({ theme }) => theme.space.xlarge};
`;

const HowItWorksTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.space.large};
`;

const StepContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.space.large};
`;

const Step = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.padding.medium};
`;

const StepNumber = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto ${({ theme }) => theme.space.small};
  font-weight: bold;
`;

const StepTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.space.small};
`;

const StepDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
`;

const HomePage: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  const handleRegister = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup',
      },
    });
  };

  return (
    <HomeContainer>
      <Hero>
        <Title>Controla tus gastos de forma sencilla</Title>
        <Subtitle>Una herramienta personal para gestionar tus finanzas con facilidad</Subtitle>
        <Button onClick={handleRegister} variant="primary">
          Empieza gratis
        </Button>
      </Hero>

      <FeaturesSection>
        <FeatureCard>
          <FeatureIcon>
            <FaCamera />
          </FeatureIcon>
          <FeatureTitle>Registro fácil de gastos</FeatureTitle>
          <FeatureDescription>Captura tus gastos con fotos o notas de voz</FeatureDescription>
        </FeatureCard>
        <FeatureCard>
          <FeatureIcon>
            <FaTags />
          </FeatureIcon>
          <FeatureTitle>Categorización inteligente</FeatureTitle>
          <FeatureDescription>Organiza automáticamente tus gastos con IA</FeatureDescription>
        </FeatureCard>
        <FeatureCard>
          <FeatureIcon>
            <FaCog />
          </FeatureIcon>
          <FeatureTitle>Personalización</FeatureTitle>
          <FeatureDescription>Crea y gestiona tus propias categorías</FeatureDescription>
        </FeatureCard>
      </FeaturesSection>

      <HowItWorksSection>
        <HowItWorksTitle>Cómo funciona</HowItWorksTitle>
        <StepContainer>
          <Step>
            <StepNumber>1</StepNumber>
            <StepTitle>Regístrate y personaliza</StepTitle>
            <StepDescription>Crea tu cuenta y configura tus categorías</StepDescription>
          </Step>
          <Step>
            <StepNumber>2</StepNumber>
            <StepTitle>Registra tus gastos</StepTitle>
            <StepDescription>Manual o automáticamente con fotos o voz</StepDescription>
          </Step>
          <Step>
            <StepNumber>3</StepNumber>
            <StepTitle>Visualiza y analiza</StepTitle>
            <StepDescription>Revisa y comprende tus patrones de gasto</StepDescription>
          </Step>
        </StepContainer>
      </HowItWorksSection>
    </HomeContainer>
  );
};

export default HomePage;
