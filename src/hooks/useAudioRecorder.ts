import { useState, useCallback } from 'react';

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const startRecording = useCallback(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks: BlobPart[] = [];

        mediaRecorder.addEventListener("dataavailable", event => {
          audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          setAudioBlob(audioBlob);
          setIsRecording(false);
        });

        mediaRecorder.start();
        setIsRecording(true);

        return mediaRecorder;
      })
      .catch(error => {
        console.error('Error accessing the microphone', error);
      });
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
  }, []);

  return { isRecording, audioBlob, startRecording, stopRecording };
};