// src/components/expenses/AudioRecorderContainer.tsx
import React from 'react';
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
  box-shadow: ${theme.boxShadow};
`;

const StatusText = styled.p`
  font-size: ${theme.fontSize.medium};
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
  isRecording,
  recordingTime,
  statusText,
  children,
}) => (
  <Container>
    <StatusText>{statusText}</StatusText>
    {children}
  </Container>
);

export default AudioRecorderContainer;