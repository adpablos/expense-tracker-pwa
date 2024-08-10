/* eslint-disable import/no-named-as-default */
import React, { useState, useCallback, useMemo } from 'react';
import { FaFileAlt, FaMicrophone, FaImage } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { AppDispatch } from '../../store';
import { createExpense } from '../../store/slices/expensesSlice';
import { Expense, ExpenseInput } from '../../types';
import { dateToString, getCurrentLocalDate } from '../../utils/dateUtils';
import Button from '../common/Button';
import ErrorModal from '../common/ErrorModal';
import SuccessModal from '../common/SuccessModal';

import AudioRecorder from './audio/AudioRecorder';
import ImageUploader from './ImageUploader';
import ManualExpenseForm from './ManualExpenseForm';

const FormContainer = styled.section`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  padding: ${({ theme }) => theme.space.medium};
`;

const OptionContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.space.small};
  margin-bottom: ${({ theme }) => theme.space.medium};
`;

const ContentContainer = styled.div`
  width: 100%;
`;

type InputMethod = 'manual' | 'audio' | 'image';

const ExpenseFormComponent: React.FC = () => {
  const [inputMethod, setInputMethod] = useState<InputMethod | null>(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedExpense, setSubmittedExpense] = useState<Expense | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const handleExpenseSubmit = useCallback(
    async (expense: ExpenseInput) => {
      if (isSubmitting) return;
      setIsSubmitting(true);
      try {
        const expenseWithFormattedDate = {
          ...expense,
          date: dateToString(
            expense.expenseDatetime ? new Date(expense.expenseDatetime) : getCurrentLocalDate()
          ),
        };
        const resultAction = await dispatch(createExpense(expenseWithFormattedDate));
        if (createExpense.fulfilled.match(resultAction)) {
          setSubmittedExpense(resultAction.payload);
          setSuccessModalOpen(true);
        } else {
          throw new Error('Failed to create expense');
        }
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
        setErrorModalOpen(true);
      } finally {
        setIsSubmitting(false);
        setInputMethod(null);
      }
    },
    [dispatch]
  );

  const handleFileUploadComplete = useCallback((expense: Expense) => {
    setSubmittedExpense(expense);
    setSuccessModalOpen(true);
    setInputMethod(null);
  }, []);

  const handleExpenseError = useCallback((message: string) => {
    setErrorMessage(message);
    setErrorModalOpen(true);
  }, []);

  const toggleInputMethod = useCallback((method: InputMethod) => {
    setInputMethod((prev) => (prev === method ? null : method));
  }, []);

  const renderContent = useMemo(() => {
    switch (inputMethod) {
      case 'manual':
        return <ManualExpenseForm onSubmit={handleExpenseSubmit} />;
      case 'audio':
        return (
          <AudioRecorder onUploadComplete={handleFileUploadComplete} onError={handleExpenseError} />
        );
      case 'image':
        return (
          <ImageUploader
            onUploadComplete={handleFileUploadComplete}
            onReset={() => setInputMethod(null)}
          />
        );
      default:
        return null;
    }
  }, [inputMethod, handleExpenseSubmit, handleFileUploadComplete, handleExpenseError]);

  return (
    <FormContainer>
      <OptionContainer>
        <Button
          variant={inputMethod === 'manual' ? 'primary' : 'secondary'}
          onClick={() => toggleInputMethod('manual')}
          isRound
        >
          <FaFileAlt />
        </Button>
        <Button
          variant={inputMethod === 'audio' ? 'primary' : 'secondary'}
          onClick={() => toggleInputMethod('audio')}
          isRound
        >
          <FaMicrophone />
        </Button>
        <Button
          variant={inputMethod === 'image' ? 'primary' : 'secondary'}
          onClick={() => toggleInputMethod('image')}
          isRound
        >
          <FaImage />
        </Button>
      </OptionContainer>
      {inputMethod && <ContentContainer>{renderContent}</ContentContainer>}
      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => {
          setSuccessModalOpen(false);
          setSubmittedExpense(null);
        }}
        expense={submittedExpense}
        title="Gasto registrado con éxito"
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

const ExpenseForm = React.memo(ExpenseFormComponent);
ExpenseForm.displayName = 'ExpenseForm';

export default ExpenseForm;
