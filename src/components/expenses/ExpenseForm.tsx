import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { createExpense } from '../../store/slices/expensesSlice';
import { fetchCategories } from '../../store/slices/categoriesSlice';
import { RootState, AppDispatch } from '../../store';
import { Category, Subcategory, ExpenseInput, Expense } from '../../types';
import { theme } from '../../styles/theme';
import ExpenseInputSelector, { InputMethod } from './ExpenseInputSelector';
import AudioRecorder from './AudioRecorder';
import ImageUploader from './ImageUploader';
import SuccessModal from '../common/SuccessModal';
import NavigationBar from '../common/NavigationBar';


const FormContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: ${theme.padding.medium};
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius};
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.padding.medium};
`;

const Input = styled.input`
  padding: ${theme.padding.small};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius};
`;

const Select = styled.select`
  padding: ${theme.padding.small};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius};
`;

const Button = styled.button`
  padding: ${theme.padding.small};
  background-color: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius};
  cursor: pointer;

  &:hover {
    background-color: ${theme.colors.primaryHover};
  }
`;

const BackButton = styled(Button)`
  margin-top: ${theme.padding.medium};
  background-color: ${theme.colors.background};
  color: ${theme.colors.text};
  border: 1px solid ${theme.colors.border};

  &:hover {
    background-color: ${theme.colors.border};
  }
`;

const ExpenseForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { categories, subcategories } = useSelector((state: RootState) => state.categories);
    const expenseStatus = useSelector((state: RootState) => state.expenses.status);
    const expenseError = useSelector((state: RootState) => state.expenses.error);

    const [inputMethod, setInputMethod] = useState<InputMethod | null>(null);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [subcategoryId, setSubcategoryId] = useState('');
    const [date, setDate] = useState('');
    const [message, setMessage] = useState('');
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [submittedExpense, setSubmittedExpense] = useState<Expense | null>(null);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const resetForm = () => {
        setDescription('');
        setAmount('');
        setCategoryId('');
        setSubcategoryId('');
        setDate('');
        setInputMethod(null);
    };

    useEffect(() => {
        if (expenseStatus === 'succeeded') {
            setMessage('Gasto registrado con éxito');
            setTimeout(() => setMessage(''), 3000);
        } else if (expenseStatus === 'failed') {
            setMessage(`Error al registrar el gasto: ${expenseError}`);
        }
    }, [expenseStatus, expenseError]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const selectedCategory = categories.find(cat => cat.id === categoryId);
        const selectedSubcategory = subcategories.find(sub => sub.id === subcategoryId);

        if (!selectedCategory || !selectedSubcategory) {
            setMessage('Por favor, selecciona una categoría y subcategoría válidas.');
            return;
        }

        const expenseData: ExpenseInput = {
            description,
            amount: parseFloat(amount),
            category: selectedCategory.name,
            subcategory: selectedSubcategory.name,
            date
        };

        console.log('Intentando registrar gasto:', expenseData);
        const result = await dispatch(createExpense(expenseData));
        if (createExpense.fulfilled.match(result)) {
            setSubmittedExpense(result.payload);
            setSuccessModalOpen(true);
            resetForm();
        }
    };

    const handleUploadComplete = (expense: Expense) => {
        setSubmittedExpense(expense);
        setSuccessModalOpen(true);
        setInputMethod(null);
    };

    const filteredSubcategories = subcategories.filter(sub => sub.categoryId === categoryId);

    return (
        <FormContainer>
            {inputMethod && <NavigationBar onHome={() => setInputMethod(null)} />}
            {!inputMethod ? (
                <ExpenseInputSelector onSelectMethod={setInputMethod} />
            ) : inputMethod === 'manual' ? (
                <Form onSubmit={handleSubmit}>
                    <Input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descripción del gasto"
                        required
                    />
                    <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Cantidad"
                        required
                    />
                    <Select
                        value={categoryId}
                        onChange={(e) => {
                            setCategoryId(e.target.value);
                            setSubcategoryId('');
                        }}
                        required
                    >
                        <option value="">Selecciona una categoría</option>
                        {categories.map((category: Category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </Select>
                    <Select
                        value={subcategoryId}
                        onChange={(e) => setSubcategoryId(e.target.value)}
                        required
                        disabled={!categoryId}
                    >
                        <option value="">Selecciona una subcategoría</option>
                        {filteredSubcategories.map((subcategory: Subcategory) => (
                            <option key={subcategory.id} value={subcategory.id}>
                                {subcategory.name}
                            </option>
                        ))}
                    </Select>
                    <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                    <Button type="submit">Registrar gasto</Button>
                </Form>
            ) : inputMethod === 'audio' ? (
                <AudioRecorder onUploadComplete={handleUploadComplete} />
            ) : (
                <ImageUploader onUploadComplete={handleUploadComplete} />
            )}
            {submittedExpense && (
                <SuccessModal
                    isOpen={successModalOpen}
                    onClose={() => setSuccessModalOpen(false)}
                    expense={submittedExpense}
                />
            )}
        </FormContainer>
    );
};

export default ExpenseForm;