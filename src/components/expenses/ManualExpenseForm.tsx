import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { createExpense } from '../../store/slices/expensesSlice';
import { RootState, AppDispatch } from '../../store';
import { Category, Subcategory, ExpenseInput, Expense } from '../../types';
import { theme } from '../../styles/theme';
import SubmitButton from '../common/SubmitButton';

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

interface ManualExpenseFormProps {
  onSubmit: (expense: Expense) => void;
}

const ManualExpenseForm: React.FC<ManualExpenseFormProps> = ({ onSubmit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, subcategories } = useSelector((state: RootState) => state.categories);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCategory = categories.find(cat => cat.id === categoryId);
    const selectedSubcategory = subcategories.find(sub => sub.id === subcategoryId);

    if (!selectedCategory) {
      // Handle error
      return;
    }

    const expenseData: ExpenseInput = {
      description,
      amount: parseFloat(amount),
      category: selectedCategory.name,
      subcategory: subcategoryId ? subcategories.find(sub => sub.id === subcategoryId)?.name || 'Sin subcategoría' : 'Sin subcategoría',
      date
    };

    const result = await dispatch(createExpense(expenseData));
    if (createExpense.fulfilled.match(result)) {
        console.log("Expense submitted:", result.payload); 
        onSubmit(result.payload);
    } else {
      // Handle error
      console.error("Failed to create expense:", result.error);
    }
  };

  const filteredSubcategories = subcategories.filter(sub => sub.categoryId === categoryId);

  return (
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
      <SubmitButton type="submit">
        Registrar gasto
      </SubmitButton>
    </Form>
  );
};

export default ManualExpenseForm;