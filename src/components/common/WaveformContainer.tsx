// src/components/common/WaveformContainer.tsx
import React from 'react';
// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components';

import { theme } from '../../styles/theme';

const Container = styled.div<{ isVisible: boolean }>`
  width: 100%;
  height: 100px;
  background-color: ${theme.colors.waveformBackground};
  border-radius: ${theme.borderRadius};
  overflow: hidden;
  display: ${(props) => (props.isVisible ? 'block' : 'none')};
  position: relative;
`;

const Waveform = styled.canvas`
  width: 100%;
  height: 100%;
`;

const PlaybackPosition = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: ${theme.colors.error};
  transition: left 0.1s linear;
`;

interface WaveformContainerProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isVisible: boolean;
  playbackPosition: number;
}

const WaveformContainer: React.FC<WaveformContainerProps> = ({
  canvasRef,
  isVisible,
  playbackPosition,
}) => (
  <Container isVisible={isVisible}>
    <Waveform ref={canvasRef} width={800} height={100} />
    <PlaybackPosition style={{ left: `${playbackPosition}px` }} />
  </Container>
);

export default WaveformContainer;
