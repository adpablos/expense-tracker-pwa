// src/components/expenses/AudioRecorderContainer.tsx
import React from 'react';
// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components';

import { theme } from '../../../styles/theme';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.padding.large};
  padding: ${theme.padding.large};
  background-color: ${theme.colors.backgroundLight};
  border-radius: ${theme.borderRadius};
  box-shadow: ${theme.shadows.medium};
`;

const StatusText = styled.p`
  font-size: ${theme.fontSizes.medium};
  color: ${theme.colors.text};
  margin: 0;
`;

interface AudioRecorderContainerProps {
  isRecording: boolean;
  recordingTime: number;
  statusText: string;
  children: React.ReactNode;
}

const AudioRecorderContainer: React.FC<AudioRecorderContainerProps> = ({
  statusText,
  children,
}) => (
  <Container>
    <StatusText>{statusText}</StatusText>
    {children}
  </Container>
);

export default AudioRecorderContainer;
