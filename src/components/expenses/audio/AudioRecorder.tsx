import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FaMicrophone, FaPause, FaPlay, FaTrash, FaPaperPlane } from 'react-icons/fa';
import { theme } from '../../../styles/theme';
import { Expense } from '../../../types';
import { uploadExpenseFile } from '../../../services/api';

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
  height: 150px;
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
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording]);

  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const newAudioChunk = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        if (audioBlob) {
          const combinedBlob = new Blob([audioBlob, newAudioChunk], { type: 'audio/wav' });
          setAudioBlob(combinedBlob);
          await visualizeAudio(combinedBlob);
          updateAudioUrl(combinedBlob);
        } else {
          setAudioBlob(newAudioChunk);
          await visualizeAudio(newAudioChunk);
          updateAudioUrl(newAudioChunk);
        }
        audioChunksRef.current = [];
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

  const updateAudioUrl = (blob: Blob) => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    const newAudioUrl = URL.createObjectURL(blob);
    setAudioUrl(newAudioUrl);
    if (audioRef.current) {
      audioRef.current.src = newAudioUrl;
    }
  };

  const discardRecording = () => {
    stopRecording();
    setRecordingTime(0);
    setAudioBlob(null);
    audioChunksRef.current = [];
    setPlaybackPosition(0);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    if (audioRef.current) {
      audioRef.current.src = '';
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  };

  const togglePlayback = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        cancelAnimationFrame(animationFrameRef.current!);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
        updatePlaybackPosition();
      }
    }
  };

  const updatePlaybackPosition = () => {
    if (audioRef.current && canvasRef.current) {
      const progress = audioRef.current.currentTime / audioRef.current.duration;
      const canvasWidth = canvasRef.current.width;
      setPlaybackPosition(progress * canvasWidth);
      animationFrameRef.current = requestAnimationFrame(updatePlaybackPosition);
    }
  };

  const handleUpload = async () => {
    if (audioBlob) {
      try {
        const file = new File([audioBlob], 'audio_expense.wav', { type: 'audio/wav' });
        const response = await uploadExpenseFile(file);
        onUploadComplete(response.data.expense);
      } catch (error) {
        console.error('Error uploading audio:', error);
      }
    }
  };

  const visualizeAudio = async (audioBlob: Blob) => {
    const audioContext = new AudioContext();
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
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

    for (let i = 0; i < width; i++) {
      const sliceStart = step * i;
      const sliceEnd = sliceStart + step;
      const slice = data.slice(sliceStart, sliceEnd);
      const average = slice.reduce((sum, value) => sum + Math.abs(value), 0) / slice.length;
      const scaledAverage = average * height * 0.8;

      ctx.moveTo(i, height / 2 + scaledAverage / 2);
      ctx.lineTo(i, height / 2 - scaledAverage / 2);
    }

    ctx.stroke();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <RecorderContainer>
      {isRecording || !audioBlob ? (
        <>
          <MainButton
            isRecording={isRecording}
            onClick={toggleRecording}
          >
            {isRecording ? <FaPause color="white" size={40} /> : <FaMicrophone color="white" size={40} />}
          </MainButton>
          {isRecording && <Timer>{formatTime(recordingTime)}</Timer>}
        </>
      ) : (
        <>
          <MainButton
            isRecording={false}
            onClick={toggleRecording}
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
      <audio 
        ref={audioRef} 
        onEnded={() => setIsPlaying(false)} 
      />
    </RecorderContainer>
  );
};

export default AudioRecorder;