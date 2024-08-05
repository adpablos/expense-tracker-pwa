import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FaMicrophone, FaPause, FaPlay, FaTrash, FaPaperPlane } from 'react-icons/fa';
import { theme } from '../../../styles/theme';
import { Expense } from '../../../types';
import { uploadExpenseFile } from '../../../services/api';
import LoadingOverlay from '../../common/LoadingOverlay';

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
  box-sizing: border-box;
  background-color: ${theme.colors.backgroundLight};
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const MainButton = styled.button<{ isRecording: boolean }>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: ${props => props.isRecording ? theme.colors.error : theme.colors.primary};
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  ${props => props.isRecording && css`
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
  background-color: ${props => props.color || theme.colors.primary};
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
  height: 100%;
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

interface AudioRecorderProps {
  onUploadComplete: (expense: Expense) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onUploadComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRecording]);

  useEffect(() => {
    if (audioBlob && audioBufferRef.current) {
      visualizeAudio(audioBufferRef.current);
    }
  }, [audioBlob]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      const audioChunks: Blob[] = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const newAudioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        await combineAudioBlobs(newAudioBlob);
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
      streamRef.current?.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const combineAudioBlobs = async (newBlob: Blob) => {
    const audioContext = audioContextRef.current!;
    
    const [existingBuffer, newBuffer] = await Promise.all([
      audioBlob ? audioContext.decodeAudioData(await audioBlob.arrayBuffer()) : null,
      audioContext.decodeAudioData(await newBlob.arrayBuffer())
    ]);
  
    let combinedBuffer: AudioBuffer;
    if (existingBuffer) {
      const combinedLength = existingBuffer.length + newBuffer.length;
      combinedBuffer = audioContext.createBuffer(
        existingBuffer.numberOfChannels,
        combinedLength,
        existingBuffer.sampleRate
      );
  
      for (let channel = 0; channel < existingBuffer.numberOfChannels; channel++) {
        const combinedChannelData = combinedBuffer.getChannelData(channel);
        combinedChannelData.set(existingBuffer.getChannelData(channel), 0);
        combinedChannelData.set(newBuffer.getChannelData(channel), existingBuffer.length);
      }
    } else {
      combinedBuffer = newBuffer;
    }
  
    audioBufferRef.current = combinedBuffer;
    const combinedBlob = await audioBufferToWav(combinedBuffer);
    setAudioBlob(combinedBlob);
  
    // Forzamos un re-render después de actualizar el estado
    setTimeout(() => {
      visualizeAudio(combinedBuffer);
    }, 0);
  };

  const audioBufferToWav = async (buffer: AudioBuffer): Promise<Blob> => {
    const wavFile = await new Promise<Blob>((resolve) => {
      const numberOfChannels = buffer.numberOfChannels;
      const sampleRate = buffer.sampleRate;
      const length = buffer.length * numberOfChannels * 2;
      const arrayBuffer = new ArrayBuffer(44 + length);
      const view = new DataView(arrayBuffer);

      // Write WAV header
      writeString(view, 0, 'RIFF');
      view.setUint32(4, 36 + length, true);
      writeString(view, 8, 'WAVE');
      writeString(view, 12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, numberOfChannels, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * numberOfChannels * 2, true);
      view.setUint16(32, numberOfChannels * 2, true);
      view.setUint16(34, 16, true);
      writeString(view, 36, 'data');
      view.setUint32(40, length, true);

      // Write audio data
      const offset = 44;
      for (let i = 0; i < buffer.length; i++) {
        for (let channel = 0; channel < numberOfChannels; channel++) {
          const sample = buffer.getChannelData(channel)[i];
          view.setInt16(offset + (i * numberOfChannels + channel) * 2, sample * 0x7fff, true);
        }
      }

      resolve(new Blob([arrayBuffer], { type: 'audio/wav' }));
    });

    return wavFile;
  };

  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
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
  
    ctx.fillStyle = theme.colors.waveformBackground;
    ctx.fillRect(0, 0, width, height);
  
    ctx.lineWidth = 2;
    ctx.strokeStyle = theme.colors.primary;
    ctx.beginPath();
  
    const centerY = height / 2;
    const amplitudeScale = height * 2;
  
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

  const togglePlayback = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  const startPlayback = () => {
    if (!audioBufferRef.current || !audioContextRef.current) return;

    sourceNodeRef.current = audioContextRef.current.createBufferSource();
    sourceNodeRef.current.buffer = audioBufferRef.current;
    sourceNodeRef.current.connect(audioContextRef.current.destination);

    sourceNodeRef.current.start();
    setIsPlaying(true);
    startTimeRef.current = audioContextRef.current.currentTime;
    animatePlayback();
  };

  const stopPlayback = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
    setPlaybackPosition(0);
    cancelAnimationFrame(animationFrameRef.current!);
  };

  const animatePlayback = () => {
    if (!audioBufferRef.current || !audioContextRef.current || !canvasRef.current) return;

    const currentTime = audioContextRef.current.currentTime - startTimeRef.current;
    const duration = audioBufferRef.current.duration;
    const progress = currentTime / duration;
    const canvasWidth = canvasRef.current.width;

    setPlaybackPosition(progress * canvasWidth);

    if (currentTime < duration) {
      animationFrameRef.current = requestAnimationFrame(animatePlayback);
    } else {
      stopPlayback();
    }
  };

  const discardRecording = () => {
    stopRecording();
    stopPlayback();
    setRecordingTime(0);
    setAudioBlob(null);
    audioBufferRef.current = null;
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handleUpload = async () => {
    if (audioBlob) {
      try {
        setIsLoading(true);
        const file = new File([audioBlob], 'audio_expense.wav', { type: 'audio/wav' });
        const response = await uploadExpenseFile(file);
        onUploadComplete(response.data.expense);
      } catch (error) {
        console.error('Error uploading audio:', error);
      } finally {
        setIsLoading(false);
      }
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
            {isRecording ? <FaPause color="white" size={40} /> : <FaMicrophone color="white" size={40} />}
          </MainButton>
          <Timer>{formatTime(recordingTime)}</Timer>
        </>
      ) : (
        <>
          <MainButton
            isRecording={false}
            onClick={startRecording}
          >
            <FaMicrophone color="white" size={40} />
          </MainButton>
          <WaveformContainer>
            <Waveform ref={canvasRef} />
            <PlaybackPosition style={{ left: `${playbackPosition}px` }} />
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