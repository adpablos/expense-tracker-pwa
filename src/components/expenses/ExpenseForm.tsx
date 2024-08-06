// src/components/expenses/ExpenseForm.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { FaFileAlt, FaMicrophone, FaImage } from 'react-icons/fa';
import { theme } from '../../styles/theme';
import ManualExpenseForm from './ManualExpenseForm';
import AudioRecorder from './audio/AudioRecorder';
import ImageUploader from './ImageUploader';
import SuccessModal from '../common/SuccessModal';
import ErrorModal from '../common/ErrorModal';
import { Expense, ExpenseInput } from '../../types';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { createExpense } from '../../store/slices/expensesSlice';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.padding.large};
`;

const OptionContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.padding.medium};
`;

const OptionButton = styled.button<{ isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${theme.padding.medium};
  background-color: ${props => props.isSelected ? theme.colors.primary : theme.colors.background};
  color: ${props => props.isSelected ? theme.colors.background : theme.colors.primary};
  border: 2px solid ${theme.colors.primary};
  border-radius: ${theme.borderRadius};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${theme.colors.primary};
    color: ${theme.colors.background};
  }

  svg {
    font-size: 1.5rem;
    margin-bottom: ${theme.padding.small};
  }
`;

const ContentContainer = styled.div`
  background-color: ${theme.colors.backgroundLight};
  border-radius: ${theme.borderRadius};
  padding: ${theme.padding.large};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

type InputMethod = 'manual' | 'audio' | 'image';

const ExpenseForm: React.FC = () => {
  const [inputMethod, setInputMethod] = useState<InputMethod | null>(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedExpense, setSubmittedExpense] = useState<Expense | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const handleExpenseSubmit = async (expense: ExpenseInput) => {
    try {
      const resultAction = await dispatch(createExpense(expense));
      if (createExpense.fulfilled.match(resultAction)) {
        setSubmittedExpense(resultAction.payload);
        setSuccessModalOpen(true);
      } else {
        throw new Error('Failed to create expense');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
      setErrorModalOpen(true);
    }
    setInputMethod(null);
  };

  const handleExpenseError = (message: string) => {
    setErrorMessage(message);
    setErrorModalOpen(true);
  };

  const renderContent = () => {
    switch (inputMethod) {
      case 'manual':
        return <ManualExpenseForm onSubmit={handleExpenseSubmit} />;
      case 'audio':
        return <AudioRecorder onUploadComplete={handleExpenseSubmit} onError={handleExpenseError} />;
      case 'image':
        return <ImageUploader onUploadComplete={handleExpenseSubmit} />;
      default:
        return null;
    }
  };

  const toggleInputMethod = (method: InputMethod) => {
    if (inputMethod === method) {
      setInputMethod(null);
    } else {
      setInputMethod(method);
    }
  };

  return (
    <FormContainer>
      <OptionContainer>
        <OptionButton
          isSelected={inputMethod === 'manual'}
          onClick={() => toggleInputMethod('manual')}
        >
          <FaFileAlt />
          Manual
        </OptionButton>
        <OptionButton
          isSelected={inputMethod === 'audio'}
          onClick={() => toggleInputMethod('audio')}
        >
          <FaMicrophone />
          Audio
        </OptionButton>
        <OptionButton
          isSelected={inputMethod === 'image'}
          onClick={() => toggleInputMethod('image')}
        >
          <FaImage />
          Imagen
        </OptionButton>
      </OptionContainer>
      {inputMethod && (
        <ContentContainer>
          {renderContent()}
        </ContentContainer>
      )}
      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => {
          setSuccessModalOpen(false);
          setSubmittedExpense(null);
        }}
        expense={submittedExpense}
      />
      <ErrorModal
        isOpen={errorModalOpen}
        onClose={() => {
          setErrorModalOpen(false);
          setErrorMessage('');
        }}
        message={errorMessage}
      />
    </FormContainer>
  );
};

export default ExpenseForm;