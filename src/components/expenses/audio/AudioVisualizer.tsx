// src/components/expenses/AudioVisualizer.tsx
import React from 'react';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';
import WaveAnimation from './WaveAnimation';

const WaveformContainer = styled.div<{ isVisible: boolean }>`
  width: 100%;
  height: 100px;
  background-color: ${theme.colors.waveformBackground};
  border-radius: ${theme.borderRadius};
  overflow: hidden;
  display: ${props => (props.isVisible ? 'block' : 'none')};
  position: relative;
`;

const Waveform = styled.canvas`
  width: 100%;
  height: 100%;
`;

interface AudioVisualizerProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  audioBlob: Blob | null;
  isRecording: boolean;
  isPaused: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ canvasRef, audioBlob, isRecording, isPaused }) => {
  return (
    <WaveformContainer isVisible={audioBlob !== null || isRecording || isPaused}>
      <Waveform ref={canvasRef} width={800} height={100} />
    </WaveformContainer>
  );
};

export default AudioVisualizer;