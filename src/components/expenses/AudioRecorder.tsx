import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaMicrophone, FaStop, FaPlay, FaPause, FaUpload } from 'react-icons/fa';
import { uploadExpenseFile } from '../../services/api';
import { Expense } from '../../types';
import { theme } from '../../styles/theme';
import SubmitButton from '../common/SubmitButton';
import ErrorModal from '../common/ErrorModal';
import LoadingOverlay from '../common/LoadingOverlay';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background-color: ${theme.colors.backgroundLight};
  border-radius: ${theme.borderRadius};
  box-shadow: ${theme.boxShadow};
`;

const WaveformContainer = styled.div<{ isVisible: boolean }>`
  width: 100%;
  height: 80px;
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius};
  overflow: hidden;
  display: ${props => props.isVisible ? 'flex' : 'none'};
  align-items: flex-end;
  justify-content: center;
  padding: 0 1rem;
`;

const Waveform = styled.div<{ height: number }>`
  height: ${props => props.height}%;
  width: 3px;
  background-color: ${theme.colors.primary};
  margin: 0 1px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background-color: ${theme.colors.primary};
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${theme.colors.primaryHover};
  }

  &:disabled {
    background-color: ${theme.colors.disabled};
    cursor: not-allowed;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background-color: ${theme.colors.primary};
  color: ${theme.colors.background};
  border: none;
  border-radius: ${theme.borderRadius};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: fit-content;

  &:hover {
    background-color: ${theme.colors.primaryHover};
  }

  svg {
    margin-right: 0.5rem;
  }
`;

interface AudioRecorderProps {
  onUploadComplete: (expense: Expense) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onUploadComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [waveform, setWaveform] = useState<number[]>([]);
  const [isWaveformVisible, setIsWaveformVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        handleAudioData(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setErrorMessage('No se pudo acceder al micrófono. Por favor, verifica los permisos e intenta de nuevo.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioBlob(file);
      handleAudioData(file);
    }
  };

  const handleAudioData = async (blob: Blob) => {
    const arrayBuffer = await blob.arrayBuffer();
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    updateWaveform(audioBuffer);
    setIsWaveformVisible(true);
  };

  const updateWaveform = (audioBuffer: AudioBuffer) => {
    const channelData = audioBuffer.getChannelData(0);
    const samples = 100;
    const blockSize = Math.floor(channelData.length / samples);
    const waveformData = [];
    for (let i = 0; i < samples; i++) {
      const start = blockSize * i;
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(channelData[start + j]);
      }
      waveformData.push(sum / blockSize);
    }
    const multiplier = Math.pow(Math.max(...waveformData), -1);
    setWaveform(waveformData.map(n => n * multiplier * 100));
  };

  const playAudio = () => {
    if (audioBlob && audioRef.current) {
      audioRef.current.src = URL.createObjectURL(audioBlob);
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };


  const handleUpload = async () => {
    if (audioBlob) {
      setIsLoading(true);
      try {
        const file = new File([audioBlob], 'audio_expense.wav', { type: 'audio/wav' });
        const response = await uploadExpenseFile(file);
        if (response.data.message === 'No expense logged.') {
          setErrorMessage('No se pudo identificar un gasto válido en el audio. Por favor, intenta de nuevo o usa otro método.');
        } else {
          onUploadComplete(response.data.expense);
        }
      } catch (error) {
        console.error('Error al cargar el audio:', error);
        setErrorMessage('Ocurrió un error al procesar el audio. Por favor, intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Container>
      {isLoading && <LoadingOverlay message="Procesando audio..." />}
      <WaveformContainer isVisible={isWaveformVisible}>
        {waveform.map((height, index) => (
          <Waveform key={index} height={height} />
        ))}
      </WaveformContainer>
      <ButtonContainer>
        {!audioBlob ? (
          <>
            {isRecording ? (
              <ActionButton onClick={stopRecording}>
                <FaStop />
              </ActionButton>
            ) : (
              <ActionButton onClick={startRecording}>
                <FaMicrophone />
              </ActionButton>
            )}
            <FileInput
              type="file"
              accept="audio/*"
              onChange={handleFileSelect}
              id="audioFileInput"
            />
            <FileButton as="label" htmlFor="audioFileInput">
              <FaUpload /> Seleccionar archivo
            </FileButton>
          </>
        ) : (
          <>
            <ActionButton onClick={isPlaying ? pauseAudio : playAudio}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </ActionButton>
            <ActionButton onClick={() => {
              setAudioBlob(null);
              setIsWaveformVisible(false);
            }}>
              <FaStop />
            </ActionButton>
          </>
        )}
      </ButtonContainer>
      {audioBlob && (
        <SubmitButton onClick={handleUpload} disabled={isLoading}>
          Registrar gasto
        </SubmitButton>
      )}
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
      <ErrorModal
        isOpen={!!errorMessage}
        onClose={() => setErrorMessage(null)}
        message={errorMessage || ''}
      />
    </Container>
  );
};

export default AudioRecorder;