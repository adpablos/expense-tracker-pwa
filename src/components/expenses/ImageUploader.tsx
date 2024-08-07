import { isAxiosError } from 'axios';
import React, { useState } from 'react';
import { FaUpload, FaImage } from 'react-icons/fa';
// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components';

import { uploadExpenseFile } from '../../services/api';
import { theme } from '../../styles/theme';
import { Expense } from '../../types';
import { convertApiExpenseToExpense } from '../../utils/expenseUtils';
import ErrorModal from '../common/ErrorModal';
import LoadingOverlay from '../common/LoadingOverlay';
import SubmitButton from '../common/SubmitButton';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
`;

const PreviewContainer = styled.div`
  width: 100%;
  max-width: 300px;
  height: 200px;
  border: 2px dashed ${theme.colors.primary};
  border-radius: 8px;
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

const FileInput = styled.input`
  display: none;
`;

const SelectImageButton = styled.button`
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

  &:hover {
    background-color: ${theme.colors.primaryHover};
  }

  svg {
    margin-right: 0.5rem;
  }
`;

interface ImageUploaderProps {
  onUploadComplete: (expense: Expense) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUploadComplete }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const handleUpload = async () => {
    if (selectedFile) {
      setIsLoading(true);
      try {
        const response = await uploadExpenseFile(selectedFile);
        // Response was successful 2xx
        const convertedExpense = convertApiExpenseToExpense(response.data.expense);
        onUploadComplete(convertedExpense);
      } catch (error) {
        console.error('Error al cargar el audio:', error);
        if (isAxiosError(error)) {
          if (error.response) {
            // El servidor respondió con un status fuera del rango 2xx
            if (error.response.status === 422) {
              setErrorMessage(
                'No se registró ningún gasto. El archivo se procesó correctamente, pero no se pudo identificar ningún gasto válido.'
              );
            } else {
              setErrorMessage('Error en la respuesta del servidor: ' + error.response.data.message);
            }
          } else if (error.request) {
            // La petición fue hecha pero no se recibió respuesta
            setErrorMessage('No se recibió respuesta del servidor. Por favor, intenta de nuevo.');
          } else {
            // Algo sucedió al configurar la petición que provocó un Error
            setErrorMessage('Error al preparar la solicitud. Por favor, intenta de nuevo.');
          }
        } else {
          // Error no relacionado con Axios
          setErrorMessage('Ocurrió un error inesperado. Por favor, intenta de nuevo.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Container>
      {isLoading && <LoadingOverlay message="Procesando imagen..." />}
      <PreviewContainer>
        {preview ? (
          <PreviewImage src={preview} alt="Preview" />
        ) : (
          <FaImage size={48} color={theme.colors.primary} />
        )}
      </PreviewContainer>
      <FileInput type="file" accept="image/*" onChange={handleFileSelect} id="imageInput" />
      <label htmlFor="imageInput">
        <SelectImageButton as="span">
          <FaUpload /> Seleccionar imagen
        </SelectImageButton>
      </label>
      {selectedFile && (
        <SubmitButton onClick={handleUpload} disabled={isLoading}>
          Registrar gasto
        </SubmitButton>
      )}
      <ErrorModal
        isOpen={!!errorMessage}
        onClose={() => setErrorMessage(null)}
        message={errorMessage || ''}
      />
    </Container>
  );
};

export default ImageUploader;
