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

export interface ExpenseInput {
  description: string;
  amount: number;
  category: string;
  subcategory: string;
  date: string;
}

export interface Expense extends ExpenseInput {
  id: string;
}

export interface UploadExpenseResponse {
  message: string;
  expense: Expense;
}