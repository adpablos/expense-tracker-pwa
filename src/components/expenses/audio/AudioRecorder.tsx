import React, { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaPause, FaPlay, FaTrash, FaPaperPlane } from 'react-icons/fa';
// eslint-disable-next-line import/no-named-as-default
import styled, { keyframes, css } from 'styled-components';

import { uploadExpenseFile } from '../../../services/api';
import { theme } from '../../../styles/theme';
import { Expense } from '../../../types';
import { convertApiExpenseToExpense } from '../../../utils/expenseUtils';
import LoadingOverlay from '../../common/LoadingOverlay';

const CANVAS_HEIGHT = 150;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
  }
  70% {
    box-shadow: 0 0 0 20px rgba(255, 0, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
  }
`;

const RecorderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  background-color: ${theme.colors.backgroundLight};
`;

const MainButton = styled.button<{ isRecording: boolean }>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: ${(props) => (props.isRecording ? theme.colors.error : theme.colors.primary)};
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  ${(props) =>
    props.isRecording &&
    css`
      animation: ${pulse} 2s infinite;
    `}

  &:hover {
    transform: scale(1.1);
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 20px;
  width: 100%;
`;

const ActionButton = styled.button<{ color?: string }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${(props) => props.color || theme.colors.primary};
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const Timer = styled.div`
  font-size: 1.5rem;
  margin-top: 20px;
  color: ${theme.colors.text};
  font-weight: bold;
`;

const WaveformContainer = styled.div`
  width: 100%;
  height: ${CANVAS_HEIGHT}px;
  background-color: ${theme.colors.waveformBackground};
  border-radius: 10px;
  overflow: hidden;
  margin: 20px 0;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
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
  background-color: ${theme.colors.primary};
  box-shadow: 0 0 5px ${theme.colors.primary};
`;

interface WindowWithWebkit extends Window {
  webkitAudioContext?: typeof AudioContext;
}

interface AudioRecorderProps {
  onUploadComplete: (expense: Expense) => void;
  onError: (message: string) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onUploadComplete, onError }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext ||
      (window as WindowWithWebkit).webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        processAudioBlob(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      startTimeRef.current = audioContextRef.current!.currentTime;
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isRecording) {
      intervalId = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRecording]);

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudioBlob = async (blob: Blob) => {
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await audioContextRef.current!.decodeAudioData(arrayBuffer);
    audioBufferRef.current = audioBuffer;
    visualizeAudio(audioBuffer);
  };

  const visualizeAudio = (audioBuffer: AudioBuffer) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const data = audioBuffer.getChannelData(0);
    const step = Math.ceil(data.length / width);

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = theme.colors.waveformBackground;
    ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = theme.colors.primary;
    ctx.beginPath();

    const centerY = height / 2;
    const amplitudeScale = height * 0.8;

    for (let i = 0; i < width; i++) {
      const sliceStart = step * i;
      const sliceEnd = sliceStart + step;
      const slice = data.slice(sliceStart, sliceEnd);
      const average = slice.reduce((sum, value) => sum + Math.abs(value), 0) / slice.length;
      const scaledAverage = average * amplitudeScale;

      ctx.moveTo(i, centerY + scaledAverage);
      ctx.lineTo(i, centerY - scaledAverage);
    }

    ctx.stroke();
  };

  const startPlayback = () => {
    if (!audioBufferRef.current || !audioContextRef.current) return;

    sourceNodeRef.current = audioContextRef.current.createBufferSource();
    sourceNodeRef.current.buffer = audioBufferRef.current;
    sourceNodeRef.current.connect(audioContextRef.current.destination);

    const offset = pausedTimeRef.current;
    sourceNodeRef.current.start(0, offset);
    setIsPlaying(true);
    startTimeRef.current = audioContextRef.current.currentTime - offset;

    animatePlayback();
  };

  const animatePlayback = () => {
    if (!audioBufferRef.current || !audioContextRef.current) return;

    const currentTime = audioContextRef.current.currentTime - startTimeRef.current;
    const duration = audioBufferRef.current.duration;
    const progress = Math.min(currentTime / duration, 1);

    setPlaybackProgress(progress);

    if (progress < 1) {
      animationFrameRef.current = requestAnimationFrame(animatePlayback);
    } else {
      stopPlayback();
    }
  };

  const stopPlayback = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current.disconnect();
    }
    setIsPlaying(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      pausedTimeRef.current = audioContextRef.current!.currentTime - startTimeRef.current;
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  const handleUpload = async () => {
    if (audioBlob) {
      try {
        setIsLoading(true);
        const file = new File([audioBlob], 'audio_expense.wav', { type: 'audio/wav' });
        const response = await uploadExpenseFile(file);
        const convertedExpense = convertApiExpenseToExpense(response.data.expense);
        onUploadComplete(convertedExpense);
      } catch (error) {
        console.error('Error uploading audio:', error);
        onError('Error al subir el audio. Por favor, inténtalo de nuevo.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const discardRecording = () => {
    stopPlayback();
    setAudioBlob(null);
    audioBufferRef.current = null;
    setRecordingTime(0);
    setPlaybackProgress(0);
    pausedTimeRef.current = 0;
    audioChunksRef.current = [];
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <RecorderContainer>
      {isLoading && <LoadingOverlay message="Procesando audio..." />}
      {isRecording || !audioBlob ? (
        <>
          <MainButton
            isRecording={isRecording}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? (
              <FaPause color="white" size={40} />
            ) : (
              <FaMicrophone color="white" size={40} />
            )}
          </MainButton>
          <Timer>{formatTime(recordingTime)}</Timer>
        </>
      ) : (
        <>
          <MainButton isRecording={false} onClick={startRecording}>
            <FaMicrophone color="white" size={40} />
          </MainButton>
          <WaveformContainer>
            <Waveform ref={canvasRef} />
            <PlaybackPosition style={{ left: `${playbackProgress * 100}%` }} />
          </WaveformContainer>
          <ControlsContainer>
            <ActionButton onClick={togglePlayback} color={theme.colors.primary}>
              {isPlaying ? <FaPause color="white" size={24} /> : <FaPlay color="white" size={24} />}
            </ActionButton>
            <ActionButton onClick={discardRecording} color={theme.colors.error}>
              <FaTrash color="white" size={24} />
            </ActionButton>
            <ActionButton onClick={handleUpload} color={theme.colors.success}>
              <FaPaperPlane color="white" size={24} />
            </ActionButton>
          </ControlsContainer>
        </>
      )}
    </RecorderContainer>
  );
};

export default AudioRecorder;
