/* eslint-disable import/no-named-as-default */
import { isAxiosError } from 'axios';
import React, { useState, useRef } from 'react';
import { FaUpload, FaImage } from 'react-icons/fa';
import styled from 'styled-components';

import { uploadExpenseFile } from '../../services/api';
import { Expense } from '../../types';
import { convertApiExpenseToExpense } from '../../utils/expenseUtils';
import Button from '../common/Button';
import ErrorModal from '../common/ErrorModal';
import LoadingOverlay from '../common/LoadingOverlay';
import SuccessModal from '../common/SuccessModal';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space.medium};
  padding: ${({ theme }) => theme.space.medium};
`;

const PreviewContainer = styled.div`
  width: 100%;
  max-width: 300px;
  height: 200px;
  border: 2px dashed ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

interface ImageUploaderProps {
  onUploadComplete: (expense: Expense) => void;
  onReset: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUploadComplete, onReset }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [uploadedExpense, setUploadedExpense] = useState<Expense | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (selectedFile) {
      setIsLoading(true);
      try {
        const response = await uploadExpenseFile(selectedFile);
        const convertedExpense = convertApiExpenseToExpense(response.data.expense);
        setUploadedExpense(convertedExpense);
        setSuccessModalOpen(true);
        onUploadComplete(convertedExpense);
      } catch (error) {
        console.error('Error al cargar la imagen:', error);
        if (isAxiosError(error)) {
          if (error.response) {
            if (error.response.status === 422) {
              setErrorMessage(
                'No se registró ningún gasto. El archivo se procesó correctamente, pero no se pudo identificar ningún gasto válido.'
              );
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

  const handleSuccessModalClose = () => {
    setSuccessModalOpen(false);
    setSelectedFile(null);
    setPreview(null);
    setUploadedExpense(null);
    onReset();
  };

  return (
    <Container>
      {isLoading && <LoadingOverlay message="Procesando imagen..." />}
      <PreviewContainer>
        {preview ? (
          <PreviewImage src={preview} alt="Preview" />
        ) : (
          <FaImage size={48} color="currentColor" />
        )}
      </PreviewContainer>
      <HiddenFileInput
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        ref={fileInputRef}
      />
      <Button onClick={handleButtonClick} variant="secondary">
        <FaUpload /> Seleccionar imagen
      </Button>
      {selectedFile && (
        <Button onClick={handleUpload} disabled={isLoading} variant="primary">
          Registrar gasto
        </Button>
      )}
      <ErrorModal
        isOpen={!!errorMessage}
        onClose={() => setErrorMessage(null)}
        message={errorMessage || ''}
      />
      <SuccessModal
        isOpen={successModalOpen}
        onClose={handleSuccessModalClose}
        expense={uploadedExpense}
        title="Gasto registrado con éxito"
      />
    </Container>
  );
};

export default ImageUploader;
