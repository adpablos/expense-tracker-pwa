// src/components/expenses/AudioWaveform.tsx
import React from 'react';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';

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

interface AudioWaveformProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isVisible: boolean;
}

const AudioWaveform: React.FC<AudioWaveformProps> = ({ canvasRef, isVisible }) => (
  <WaveformContainer isVisible={isVisible}>
    <Waveform ref={canvasRef} width={800} height={100} />
  </WaveformContainer>
);

export default AudioWaveform;