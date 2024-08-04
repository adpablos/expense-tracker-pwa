import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaFileAlt, FaMicrophone, FaImage, FaArrowLeft } from 'react-icons/fa';
import AudioRecorder from './audio/AudioRecorder';
import ImageUploader from './ImageUploader';
import ManualExpenseForm from './ManualExpenseForm';
import { Expense } from '../../types';
import { theme } from '../../styles/theme';
import SuccessModal from '../common/SuccessModal';
import ErrorModal from '../common/ErrorModal';
import { AppDispatch } from '../../store';
import { useDispatch } from 'react-redux';
import { fetchCategories } from '../../store/slices/categoriesSlice';

const FormContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: ${theme.padding.medium};
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius};
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
`;

const Title = styled.h2`
  color: ${theme.colors.text};
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
`;

const OptionContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 2rem;
`;

const OptionButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background-color: ${theme.colors.background};
  color: ${theme.colors.primary};
  border: 2px solid ${theme.colors.primary};
  border-radius: ${theme.borderRadius};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${theme.colors.primary};
    color: ${theme.colors.background};
  }

  svg {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.primary};
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
`;

type InputMethod = 'manual' | 'audio' | 'image' | null;

const ExpenseForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [inputMethod, setInputMethod] = useState<InputMethod>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [submittedExpense, setSubmittedExpense] = useState<Expense | null>(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleExpenseSubmit = (expense: Expense) => {
    console.log("Expense received in ExpenseForm:", expense); 
    setSubmittedExpense(expense);
    setSuccessModalOpen(true);
    setInputMethod(null);
  };

  const renderContent = () => {
    switch (inputMethod) {
      case 'manual':
        return <ManualExpenseForm onSubmit={handleExpenseSubmit} />;
      case 'audio':
        return <AudioRecorder onUploadComplete={handleExpenseSubmit} />;
      case 'image':
        return <ImageUploader onUploadComplete={handleExpenseSubmit} />;
      default:
        return (
          <>
            <Title>¿Cómo quieres registrar tu gasto?</Title>
            <OptionContainer>
              <OptionButton onClick={() => setInputMethod('manual')}>
                <FaFileAlt />
                Manual
              </OptionButton>
              <OptionButton onClick={() => setInputMethod('audio')}>
                <FaMicrophone />
                Audio
              </OptionButton>
              <OptionButton onClick={() => setInputMethod('image')}>
                <FaImage />
                Imagen
              </OptionButton>
            </OptionContainer>
          </>
        );
    }
  };

  return (
    <FormContainer>
      {inputMethod && (
        <BackButton onClick={() => setInputMethod(null)}>
          <FaArrowLeft style={{ marginRight: '0.5rem' }} />
          Volver
        </BackButton>
      )}
      {renderContent()}
      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => {
          setSuccessModalOpen(false);
          setSubmittedExpense(null);
        }}
        expense={submittedExpense}
      />
      <ErrorModal
        isOpen={!!errorMessage}
        onClose={() => setErrorMessage(null)}
        message={errorMessage || ''}
      />
    </FormContainer>
  );
};

export default ExpenseForm;