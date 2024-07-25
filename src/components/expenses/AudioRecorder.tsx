import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaMicrophone, FaStop, FaPlay, FaPause, FaUpload, FaTrash } from 'react-icons/fa';
import { uploadExpenseFile } from '../../services/api';
import { Expense } from '../../types';
import { theme } from '../../styles/theme';
import SubmitButton from '../common/SubmitButton';
import ErrorModal from '../common/ErrorModal';
import LoadingOverlay from '../common/LoadingOverlay';
import axios from 'axios';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.padding.large};
  padding: ${theme.padding.large};
  background-color: ${theme.colors.backgroundLight};
  border-radius: ${theme.borderRadius};
  box-shadow: ${theme.boxShadow};
`;

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

const PlaybackPosition = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: ${theme.colors.error};
  transition: left 0.1s linear;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${theme.padding.medium};
  justify-content: center;
`;

const ActionButton = styled.button<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background-color: ${props => props.isActive ? theme.colors.error : theme.colors.primary};
  color: ${theme.colors.backgroundLight};
  font-size: ${theme.fontSize.large};
  cursor: pointer;
  transition: all ${theme.transition};

  &:hover {
    transform: scale(1.05);
    background-color: ${props => props.isActive ? theme.colors.error : theme.colors.primaryHover};
  }

  &:disabled {
    background-color: ${theme.colors.disabled};
    cursor: not-allowed;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileButton = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background-color: ${theme.colors.primary};
  color: ${theme.colors.backgroundLight};
  border: none;
  border-radius: ${theme.borderRadius};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${theme.colors.primaryHover};
  }

  svg {
    margin-right: 0.5rem;
  }
`;

const StatusText = styled.p`
  font-size: ${theme.fontSize.medium};
  color: ${theme.colors.text};
  margin: 0;
`;

interface AudioRecorderProps {
  onUploadComplete: (expense: Expense) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onUploadComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioSource, setAudioSource] = useState<'recorded' | 'uploaded' | null>(null);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener('timeupdate', updatePlaybackPosition);
      audioElement.addEventListener('ended', () => setIsPlaying(false));
    }
    return () => {
      if (audioElement) {
        audioElement.removeEventListener('timeupdate', updatePlaybackPosition);
        audioElement.removeEventListener('ended', () => setIsPlaying(false));
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (audioBlob) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (audioRef.current && e.target) {
          audioRef.current.src = e.target.result as string;
        }
      };
      reader.readAsDataURL(audioBlob);
    }
  }, [audioBlob]);

  const isRecordingSupported = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  };

  const startRecording = async () => {
    if (!isRecordingSupported()) {
      setErrorMessage('La grabación de audio no está soportada en este dispositivo.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      const options = { mimeType: 'audio/webm;codecs=opus' };
      try {
        mediaRecorderRef.current = new MediaRecorder(stream, options);
      } catch (e) {
        console.warn('audio/webm;codecs=opus not supported, trying audio/mp4');
        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/mp4' });
      }
      
      const audioChunks: Blob[] = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: mediaRecorderRef.current?.mimeType || 'audio/wav' });
        setAudioBlob(audioBlob);
        setAudioSource('recorded');
        setIsRecording(false);
        visualizeAudio(audioBlob);
        console.log('Recording stopped. Audio blob:', audioBlob);
        console.log('Audio blob type:', audioBlob.type);
        console.log('Audio blob size:', audioBlob.size);
      };

      mediaRecorderRef.current.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setErrorMessage('Error durante la grabación. Por favor, intenta de nuevo.');
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      drawWaveform();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setErrorMessage('No se pudo acceder al micrófono. Por favor, verifica los permisos e intenta de nuevo.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const drawWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    analyserRef.current.fftSize = 2048;
    const bufferLength = analyserRef.current.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);

      analyserRef.current!.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = theme.colors.waveformBackground;
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = theme.colors.waveform;
      canvasCtx.beginPath();

      const sliceWidth = WIDTH * 1.0 / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * HEIGHT / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };

    draw();
  };

  const togglePlayback = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.error('Error playing audio:', error);
          setErrorMessage('Error al reproducir el audio. Toca la pantalla e intenta de nuevo.');
        }
      }
    }
  };

  const updatePlaybackPosition = () => {
    if (audioRef.current && canvasRef.current) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      const position = (currentTime / duration) * canvasRef.current.width;
      setPlaybackPosition(position);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioBlob(file);
      setAudioSource('uploaded');
      await visualizeAudio(file);
      console.log('File selected:', file);
      console.log('File type:', file.type);
      console.log('File size:', file.size);
    }
  };

  const visualizeAudio = async (audioData: Blob | File) => {
    if (!canvasRef.current) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const arrayBuffer = await audioData.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    canvasCtx.fillStyle = theme.colors.waveformBackground;
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = theme.colors.waveform;
    canvasCtx.beginPath();

    const channelData = audioBuffer.getChannelData(0);
    const step = Math.ceil(channelData.length / WIDTH);
    const amp = HEIGHT / 2;

    for (let i = 0; i < WIDTH; i++) {
      let min = 1.0;
      let max = -1.0;
      for (let j = 0; j < step; j++) {
        const datum = channelData[(i * step) + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      canvasCtx.moveTo(i, (1 + min) * amp);
      canvasCtx.lineTo(i, (1 + max) * amp);
    }

    canvasCtx.stroke();
  };

  const resetAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setAudioSource(null);
    setIsPlaying(false);
    setPlaybackPosition(0);
    if (canvasRef.current) {
      const canvasCtx = canvasRef.current.getContext('2d');
      if (canvasCtx) {
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  const handleUpload = async () => {
    if (audioBlob) {
      setIsLoading(true);
      try {
        const file = new File([audioBlob], 'audio_expense.webm', { type: audioBlob.type });
        console.log('Uploading file:', file);
        console.log('File type:', file.type);
        console.log('File size:', file.size);

        const response = await uploadExpenseFile(file);
        onUploadComplete(response.data.expense);
      } catch (error) {
        console.error('Error al cargar el audio:', error);
        if (axios.isAxiosError(error)) {
          if (error.response) {
            if (error.response.status === 422) {
              setErrorMessage("No se registró ningún gasto. El archivo se procesó correctamente, pero no se pudo identificar ningún gasto válido.");
            } else {
              setErrorMessage('Error en la respuesta del servidor: ' + error.response.data.message);
            }
          } else if (error.request) {
            setErrorMessage('No se recibió respuesta del servidor. Por favor, intenta de nuevo.');
          } else {
            setErrorMessage('Error al preparar la solicitud. Por favor, intenta de nuevo.');
          }
        } else {
          setErrorMessage('Ocurrió un error inesperado. Por favor, intenta de nuevo.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Container>
      {isLoading && <LoadingOverlay message="Procesando audio..." />}
      <WaveformContainer isVisible={audioBlob !== null || isRecording}>
        <Waveform ref={canvasRef} width={800} height={100} />
        {audioBlob && <PlaybackPosition style={{ left: `${playbackPosition}px` }} />}
      </WaveformContainer>
      <StatusText>
        {isRecording ? 'Grabando...' : 
         audioSource === 'recorded' ? 'Audio grabado' : 
         audioSource === 'uploaded' ? 'Audio cargado' : 
         'Graba o carga un audio para registrar un gasto'}
      </StatusText>
      <ButtonContainer>
        {!audioBlob ? (
          <>
            <ActionButton onClick={isRecording ? stopRecording : startRecording} isActive={isRecording}>
              {isRecording ? <FaStop /> : <FaMicrophone />}
            </ActionButton>
            <FileInput
              type="file"
              accept="audio/*"
              onChange={handleFileSelect}
              id="audioFileInput"
            />
            <FileButton htmlFor="audioFileInput">
              <FaUpload /> Subir audio
            </FileButton>
          </>
        ) : (
          <>
            <ActionButton onClick={togglePlayback}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </ActionButton>
            <ActionButton onClick={resetAudio}>
              <FaTrash />
            </ActionButton>
          </>
        )}
      </ButtonContainer>
      {audioBlob && (
        <SubmitButton onClick={handleUpload} disabled={isLoading}>
          Registrar gasto
        </SubmitButton>
      )}
      <audio 
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <ErrorModal
        isOpen={!!errorMessage}
        onClose={() => setErrorMessage(null)}
        message={errorMessage || ''}
      />
    </Container>
  );
};

export default AudioRecorder;