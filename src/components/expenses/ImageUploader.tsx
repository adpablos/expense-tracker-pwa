// src/components/expenses/ImageUploader.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { FaUpload, FaImage } from 'react-icons/fa';
import { uploadExpenseFile } from '../../services/api';
import { Expense } from '../../types';

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
  border: 2px dashed #007bff;
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

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
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
                onUploadComplete(response.data.expense);
            } catch (error) {
                console.error('Error al cargar la imagen:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <Container>
            <PreviewContainer>
                {preview ? (
                    <PreviewImage src={preview} alt="Preview" />
                ) : (
                    <FaImage size={48} color="#007bff" />
                )}
            </PreviewContainer>
            <FileInput
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                id="imageInput"
            />
            <label htmlFor="imageInput">
                <Button as="span">
                    <FaUpload /> Seleccionar imagen
                </Button>
            </label>
            {selectedFile && (
                <Button onClick={handleUpload} disabled={isLoading}>
                    {isLoading ? 'Cargando...' : 'Confirmar y Enviar'}
                </Button>
            )}
        </Container>
    );
};

export default ImageUploader;