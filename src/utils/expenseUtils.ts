import { ExpenseFromAPI, Expense } from '../types';

export const convertApiExpenseToExpense = (apiExpense: ExpenseFromAPI): Expense => {
  return {
    ...apiExpense,
    amount: parseFloat(apiExpense.amount)
  };
};

export const formatAmount = (amount: number): string => {
  return amount.toFixed(2);
};