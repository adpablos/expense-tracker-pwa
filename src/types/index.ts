// src/types.ts

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface ExpenseBase {
  description: string;
  category: string;
  subcategory: string;
  date: string;
}

export interface ExpenseInput extends ExpenseBase {
  amount: number;
}

export interface ExpenseFromAPI extends ExpenseBase {
  id: string;
  amount: string; // Amount is a string in the API response
}

export interface Expense extends ExpenseBase {
  id: string;
  amount: number; // Amount is converted to a number for use in the app
}

export interface ExpensesAPIResponse {
  expenses: ExpenseFromAPI[];
  totalPages: number;
  // Añadimos los campos faltantes según el error
  page: number;
  nextPage: number | null;
  totalItems: number;
}
