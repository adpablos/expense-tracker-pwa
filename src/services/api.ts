import axios, { AxiosError } from 'axios';

import { ExpenseInput, ExpenseFromAPI, ExpensesAPIResponse, Category, Subcategory } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

const handleError = (error: Error | AxiosError) => {
  console.error('API error:', error);
  throw error;
};

export const getCategories = () => api.get('/categories').catch(handleError);
export const getSubcategories = () => api.get('/subcategories').catch(handleError);

export const getExpenses = (params: {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  [key: string]: string | number | undefined;
}) => api.get<ExpensesAPIResponse>('/expenses', { params }).catch(handleError);

export const apiCreateExpense = (expenseData: ExpenseInput) =>
  api.post<ExpenseFromAPI>('/expenses', expenseData).catch(handleError);

export const updateExpense = (id: string, expenseData: Partial<ExpenseInput>) =>
  api.put<ExpenseFromAPI>(`/expenses/${id}`, expenseData).catch(handleError);

export const deleteExpense = (id: string) => api.delete(`/expenses/${id}`).catch(handleError);

export const uploadExpenseFile = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return api
    .post<{ message: string; expense: ExpenseFromAPI }>('/expenses/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .catch(handleError);
};

export const createCategory = (categoryData: { name: string }) =>
  api.post<Category>('/categories', categoryData).catch(handleError);

export const updateCategory = (id: string, categoryData: { name: string }) =>
  api.put<Category>(`/categories/${id}`, categoryData).catch(handleError);

export const deleteCategory = (id: string) => api.delete(`/categories/${id}`).catch(handleError);

export const createSubcategory = (subcategoryData: { name: string; categoryId: string }) =>
  api.post<Subcategory>('/subcategories', subcategoryData).catch(handleError);

export const updateSubcategory = (
  id: string,
  subcategoryData: { name: string; categoryId: string }
) => api.put<Subcategory>(`/subcategories/${id}`, subcategoryData).catch(handleError);

export const deleteSubcategory = (id: string) =>
  api.delete(`/subcategories/${id}`).catch(handleError);

export default api;
