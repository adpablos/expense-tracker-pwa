// src/components/expenses/audio/AudioActionButtons.tsx
import React from 'react';
import { FaMicrophone, FaPause, FaTrash, FaPlay, FaCheck } from 'react-icons/fa';
import ActionButton from '../../common/ActionButton';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';
import WaveAnimation from './WaveAnimation';

const RecordingCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: ${theme.colors.primary};
  color: ${theme.colors.backgroundLight};
  position: relative;
`;

const Timer = styled.div`
  font-size: 1.5rem;
  z-index: 2;
`;

const ActionButtonWrapper = styled.div`
  position: absolute;
  bottom: 10px;
  display: flex;
  gap: 10px;

  & > button {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
`;

interface AudioActionButtonsProps {
  isRecording: boolean;
  isPaused: boolean;
  audioBlob: Blob | null;
  startRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  discardRecording: () => void;
  handleUpload: () => void;
  formattedRecordingTime: string;
}

const AudioActionButtons: React.FC<AudioActionButtonsProps> = ({
  isRecording,
  isPaused,
  audioBlob,
  startRecording,
  pauseRecording,
  resumeRecording,
  discardRecording,
  handleUpload,
  formattedRecordingTime,
}) => (
  <div>
    {(isRecording || isPaused || audioBlob) ? (
      <RecordingCircle>
        {isRecording && (
          <>
            <Timer>{formattedRecordingTime}</Timer>
            <ActionButtonWrapper>
              <ActionButton onClick={pauseRecording}>
                <FaPause />
              </ActionButton>
              <ActionButton onClick={discardRecording} isActive={true}>
                <FaTrash />
              </ActionButton>
            </ActionButtonWrapper>
          </>
        )}
        {isPaused && (
          <>
            <ActionButtonWrapper>
              <ActionButton onClick={resumeRecording}>
                <FaPlay />
              </ActionButton>
              <ActionButton onClick={discardRecording} isActive={true}>
                <FaTrash />
              </ActionButton>
            </ActionButtonWrapper>
          </>
        )}
        {audioBlob && !isRecording && !isPaused && (
          <>
            <ActionButton onClick={handleUpload}>
              <FaCheck />
            </ActionButton>
            <ActionButton onClick={discardRecording} isActive={true}>
              <FaTrash />
            </ActionButton>
          </>
        )}
      </RecordingCircle>
    ) : (
      <ActionButton onClick={startRecording}>
        <FaMicrophone />
      </ActionButton>
    )}
  </div>
);

export default AudioActionButtons;