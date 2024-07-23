import axios from 'axios';
import { Expense, ExpenseInput } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getCategories = () => api.get('/categories');
export const getSubcategories = () => api.get('/subcategories');

export const uploadExpenseFile = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return api.post<{ message: string; expense: Expense }>('/expenses/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// This function will be used internally from expensesSlice.ts
export const apiCreateExpense = (expenseData: ExpenseInput) => api.post<Expense>('/expenses', expenseData);