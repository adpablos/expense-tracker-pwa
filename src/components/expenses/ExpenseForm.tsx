import React, { useState } from 'react';
import { FaFileAlt, FaMicrophone, FaImage } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components';

import { AppDispatch } from '../../store';
import { createExpense } from '../../store/slices/expensesSlice';
import { Expense, ExpenseInput } from '../../types';
import ErrorModal from '../common/ErrorModal';
import SuccessModal from '../common/SuccessModal';

import AudioRecorder from './audio/AudioRecorder';
import ImageUploader from './ImageUploader';
import ManualExpenseForm from './ManualExpenseForm';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.large};
`;

const OptionContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.space.medium};
`;

const OptionButton = styled.button<{ isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.space.medium};
  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.primary : theme.colors.background};
  color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.background : theme.colors.primary};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.background};
  }

  svg {
    font-size: ${({ theme }) => theme.fontSizes.xlarge};
    margin-bottom: ${({ theme }) => theme.space.small};
  }
`;

const ContentContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.space.large};
  box-shadow: ${({ theme }) => theme.shadows.medium};
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
        return (
          <AudioRecorder onUploadComplete={handleExpenseSubmit} onError={handleExpenseError} />
        );
      case 'image':
        return <ImageUploader onUploadComplete={() => {}} />;
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
      {inputMethod && <ContentContainer>{renderContent()}</ContentContainer>}
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
