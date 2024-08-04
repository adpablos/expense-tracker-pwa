// src/components/expenses/audio/WaveAnimation.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';

const wave = keyframes`
  0% { transform: scale(0); opacity: 0.8; }
  50% { transform: scale(1); opacity: 0.4; }
  100% { transform: scale(1.5); opacity: 0; }
`;

const Wave = styled.div`
  position: absolute;
  border-radius: 50%;
  background-color: rgba(0, 123, 255, 0.5); 
  animation: ${wave} 1.5s linear infinite;
`;

const WaveAnimation: React.FC = () => (
  <>
    <Wave style={{ width: '100px', height: '100px', animationDelay: '0s' }} />
    <Wave style={{ width: '120px', height: '120px', animationDelay: '0.5s' }} />
    <Wave style={{ width: '140px', height: '140px', animationDelay: '1s' }} />
  </>
);

export default WaveAnimation;