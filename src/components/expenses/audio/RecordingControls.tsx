// src/components/expenses/audio/RecordingControls.tsx
import React from 'react';
import { FaMicrophone, FaPause, FaTimes, FaPlay, FaCheck } from 'react-icons/fa';
// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components';

import { theme } from '../../../styles/theme';
import ActionButton from '../../common/ActionButton';

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
  font-size: 1.2rem;
  z-index: 2;
`;

const ActionButtonWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 10px;

  & > button {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
`;

interface RecordingControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  startRecording: () => void;
  cancelRecording: () => void;
  handlePauseResume: () => void;
  handleUpload: () => void;
  formattedRecordingTime: string;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  isPaused,
  startRecording,
  cancelRecording,
  handlePauseResume,
  handleUpload,
  formattedRecordingTime,
}) => {
  return (
    <div>
      {isRecording || isPaused ? (
        <RecordingCircle>
          <WaveAnimation />
          {(isRecording || isPaused) && (
            <Timer style={{ position: 'absolute', top: '10%' }}>{formattedRecordingTime}</Timer>
          )}
          <ActionButtonWrapper>
            {isRecording && (
              <>
                <ActionButton onClick={handlePauseResume}>
                  <FaPause />
                </ActionButton>
                <ActionButton onClick={cancelRecording} isActive={true}>
                  <FaTimes />
                </ActionButton>
              </>
            )}
            {isPaused && (
              <>
                <ActionButton onClick={handlePauseResume}>
                  <FaPlay />
                </ActionButton>
                <ActionButton onClick={startRecording}>
                  <FaMicrophone />
                </ActionButton>
                <ActionButton onClick={handleUpload} isActive={true}>
                  <FaCheck />
                </ActionButton>
              </>
            )}
          </ActionButtonWrapper>
        </RecordingCircle>
      ) : (
        <ActionButton onClick={startRecording}>
          <FaMicrophone />
        </ActionButton>
      )}
    </div>
  );
};

export default RecordingControls;
