/* eslint-disable import/no-named-as-default */
import React, { useState } from 'react';
import { FaFileAlt, FaMicrophone, FaImage } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { AppDispatch } from '../../store';
import { createExpense } from '../../store/slices/expensesSlice';
import { Margin, Padding, FlexContainer } from '../../styles/utilities';
import { Expense, ExpenseInput } from '../../types';
import Button from '../common/Button';
import ErrorModal from '../common/ErrorModal';
import SuccessModal from '../common/SuccessModal';
import { Container, Row, Col } from '../layout/Grid';

import AudioRecorder from './audio/AudioRecorder';
import ImageUploader from './ImageUploader';
import ManualExpenseForm from './ManualExpenseForm';

const FormContainer = styled(Container)`
  ${({ theme }) => `
    @media (max-width: ${theme.breakpoints.tablet}) {
      padding-left: ${theme.space.small};
      padding-right: ${theme.space.small};
    }
  `}
`;

const OptionContainer = styled(FlexContainer)`
  justify-content: center;
`;

const ContentContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
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
        return (
          <ImageUploader
            onUploadComplete={handleExpenseSubmit}
            onReset={() => setInputMethod(null)}
          />
        );
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
      <Row>
        <Col xs={12}>
          <OptionContainer>
            <Margin size="medium" direction="right">
              <Button
                variant={inputMethod === 'manual' ? 'primary' : 'secondary'}
                onClick={() => toggleInputMethod('manual')}
                isRound
              >
                <FaFileAlt />
              </Button>
            </Margin>
            <Margin size="medium" direction="right">
              <Button
                variant={inputMethod === 'audio' ? 'primary' : 'secondary'}
                onClick={() => toggleInputMethod('audio')}
                isRound
              >
                <FaMicrophone />
              </Button>
            </Margin>
            <Button
              variant={inputMethod === 'image' ? 'primary' : 'secondary'}
              onClick={() => toggleInputMethod('image')}
              isRound
            >
              <FaImage />
            </Button>
          </OptionContainer>
        </Col>
      </Row>
      {inputMethod && (
        <Margin size="large" direction="top">
          <ContentContainer>
            <Padding size="large">{renderContent()}</Padding>
          </ContentContainer>
        </Margin>
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
