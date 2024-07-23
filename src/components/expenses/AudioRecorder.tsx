import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaMicrophone, FaStop, FaPlay, FaPause } from 'react-icons/fa';
import { uploadExpenseFile } from '../../services/api';
import { Expense } from '../../types';
import { theme } from '../../styles/theme';
import SubmitButton from '../common/SubmitButton';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: ${theme.colors.backgroundLight};
  border-radius: ${theme.borderRadius};
  box-shadow: ${theme.boxShadow};
`;

const WaveformContainer = styled.div`
  width: 100%;
  height: 60px;
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius};
  overflow: hidden;
  margin-bottom: 1rem;
`;

const Waveform = styled.div<{ height: number }>`
  height: ${props => props.height}%;
  background-color: ${theme.colors.primary};
  width: 2px;
  margin: 0 1px;
  display: inline-block;
  vertical-align: bottom;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const CircleButton = styled.button`
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

interface AudioRecorderProps {
  onUploadComplete: (expense: Expense) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onUploadComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [waveform, setWaveform] = useState<number[]>([]);
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
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAudioData = async (blob: Blob) => {
    const arrayBuffer = await blob.arrayBuffer();
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    updateWaveform(audioBuffer);
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
        onUploadComplete(response.data.expense);
      } catch (error) {
        console.error('Error al cargar el audio:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Container>
      <WaveformContainer>
        {waveform.map((height, index) => (
          <Waveform key={index} height={height} />
        ))}
      </WaveformContainer>
      <ButtonContainer>
        {isRecording ? (
          <CircleButton onClick={stopRecording}><FaStop /></CircleButton>
        ) : (
          <CircleButton onClick={startRecording}><FaMicrophone /></CircleButton>
        )}
        {audioBlob && (
          <CircleButton onClick={isPlaying ? pauseAudio : playAudio}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </CircleButton>
        )}
      </ButtonContainer>
      {audioBlob && (
        <SubmitButton onClick={handleUpload} disabled={isLoading}>
          Submit
        </SubmitButton>
      )}
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
    </Container>
  );
};

export default AudioRecorder;