// src/components/common/AudioRecorderContainer.tsx
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const AudioRecorderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.padding.large};
  padding: ${theme.padding.large};
  background-color: ${theme.colors.backgroundLight};
  border-radius: ${theme.borderRadius};
  box-shadow: ${theme.boxShadow};
`;

export default AudioRecorderContainer;
