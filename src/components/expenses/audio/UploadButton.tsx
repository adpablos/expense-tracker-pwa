// src/components/expenses/audio/UploadButton.tsx
import React from 'react';
import { FaCheck } from 'react-icons/fa';

import SubmitButton from '../../common/SubmitButton';

interface UploadButtonProps {
  audioBlob: Blob | null;
  handleUpload: () => void;
  isLoading: boolean;
}

const UploadButton: React.FC<UploadButtonProps> = ({ audioBlob, handleUpload, isLoading }) =>
  audioBlob && !isLoading ? (
    <SubmitButton onClick={handleUpload}>
      <FaCheck /> Enviar
    </SubmitButton>
  ) : null;

export default UploadButton;
