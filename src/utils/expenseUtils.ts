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

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  const adjustedDate = new Date(date.getTime() - userTimezoneOffset);

  return adjustedDate.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const stringToDate = (dateString: string): Date | null => {
  const parts = dateString.split('/');
  if (parts.length !== 3) {
    return null;
  }

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return null;
  }

  return new Date(Date.UTC(year, month, day));
};
