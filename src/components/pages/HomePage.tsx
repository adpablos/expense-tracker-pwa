/* eslint-disable import/no-named-as-default */
import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import { FaBolt, FaCamera, FaShieldAlt } from 'react-icons/fa';
import styled from 'styled-components';

import Button from '../common/Button';
import Container from '../ui/Container';

const HomeContainer = styled(Container)`
  padding-top: ${({ theme }) => theme.space.xxlarge};
  padding-bottom: ${({ theme }) => theme.space.xxlarge};
`;

const Hero = styled.section`
  text-align: center;
  margin: 0 auto ${({ theme }) => theme.space.xxlarge};
  max-width: 880px;
  padding: ${({ theme }) => theme.space.xxlarge} ${({ theme }) => theme.space.medium};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const Badge = styled.span`
  display: inline-block;
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primaryLight}22;
  border: 1px solid ${({ theme }) => theme.colors.primaryLight};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  padding: 0.25rem 0.6rem;
  margin-bottom: ${({ theme }) => theme.space.small};
`;

const Title = styled.h1`
  font-size: clamp(2.4rem, 3.8vw, 3.5rem);
  color: ${({ theme }) => theme.colors.dark};
  letter-spacing: -0.02em;
  margin-bottom: ${({ theme }) => theme.space.small};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.textLight};
  margin: 0 auto ${({ theme }) => theme.space.large};
  max-width: 720px;
`;

const Actions = styled.div`
  display: inline-flex;
  gap: ${({ theme }) => theme.space.small};
`;

const Features = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${({ theme }) => theme.space.large};
  margin: 0 auto ${({ theme }) => theme.space.xxlarge};
  max-width: 980px;
`;

const Feature = styled.div`
  text-align: left;
  padding: ${({ theme }) => theme.space.medium};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background: ${({ theme }) => theme.colors.surface};
`;

const FeatureIcon = styled.div`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.space.small};
`;

const FeatureTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.space.xsmall};
`;

const FeatureCopy = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  margin: 0;
`;

const SmallNote = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: -${({ theme }) => theme.space.large};
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
        <Badge>Minimal expense tracking</Badge>
        <Title>Track your spending without the friction</Title>
        <Subtitle>
          Capture a receipt in seconds, let AI categorize it, and instantly see where your money
          goes. No spreadsheets. No busywork. Just clarity.
        </Subtitle>
        <Actions>
          <Button onClick={handleRegister} variant="primary">
            Create account
          </Button>
          <Button onClick={() => loginWithRedirect()} variant="secondary">
            Sign in
          </Button>
        </Actions>
      </Hero>

      <Features>
        <Feature>
          <FeatureIcon>
            <FaCamera />
          </FeatureIcon>
          <FeatureTitle>Capture fast</FeatureTitle>
          <FeatureCopy>Snap a photo or record audio. We parse and prefill for you.</FeatureCopy>
        </Feature>
        <Feature>
          <FeatureIcon>
            <FaBolt />
          </FeatureIcon>
          <FeatureTitle>Smart categorization</FeatureTitle>
          <FeatureCopy>AI assigns category and subcategory; you keep full control.</FeatureCopy>
        </Feature>
        <Feature>
          <FeatureIcon>
            <FaShieldAlt />
          </FeatureIcon>
          <FeatureTitle>Made for households</FeatureTitle>
          <FeatureCopy>Share budgets, manage members, and stay in sync effortlessly.</FeatureCopy>
        </Feature>
      </Features>

      <SmallNote>Works great on mobile. Install it as a PWA for a native feel.</SmallNote>
    </HomeContainer>
  );
};

export default HomePage;
