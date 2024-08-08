import { ExpenseFromAPI, Expense } from '../types';

export const convertApiExpenseToExpense = (apiExpense: ExpenseFromAPI): Expense => {
  return {
    ...apiExpense,
    amount: parseFloat(apiExpense.amount),
  };
};

export const formatAmount = (amount: number): string => {
  return amount.toFixed(2);
};

export const stringToDate = (dateString: string): Date | null => {
  const parts = dateString.split('/');
  if (parts.length !== 3) {
    return null;
  }

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Los meses en Date son base 0
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return null;
  }

  return new Date(year, month, day);
};
