import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Expense, ExpenseInput, ExpenseFromAPI, ExpensesAPIResponse } from '../../types';
import { convertApiExpenseToExpense } from '../../utils/expenseUtils';
import * as api from '../../services/api';

interface ExpensesState {
  items: Expense[];
  recentItems: Expense[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  totalPages: number;
}

const initialState: ExpensesState = {
  items: [],
  recentItems: [],
  status: 'idle',
  error: null,
  totalPages: 0,
};

interface FetchExpensesParams {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export const fetchExpenses = createAsyncThunk<ExpensesAPIResponse, FetchExpensesParams>(
  'expenses/fetchExpenses',
  async (params) => {
    const response = await api.getExpenses(params);
    return response.data;
  }
);

export const createExpense = createAsyncThunk<Expense, ExpenseInput>(
  'expenses/createExpense',
  async (expenseData, { rejectWithValue }) => {
    try {
      const response = await api.apiCreateExpense(expenseData);
      return convertApiExpenseToExpense(response.data);
    } catch (err) {
      return rejectWithValue((err as any).message || 'Error al crear gasto');
    }
  }
);

export const updateExpense = createAsyncThunk<Expense, { id: string; expenseData: Partial<ExpenseInput> }>(
  'expenses/updateExpense',
  async ({ id, expenseData }, { rejectWithValue }) => {
    try {
      const response = await api.updateExpense(id, expenseData);
      return convertApiExpenseToExpense(response.data);
    } catch (err) {
      return rejectWithValue((err as any).message || 'Error al actualizar gasto');
    }
  }
);

export const deleteExpense = createAsyncThunk<string, string>(
  'expenses/deleteExpense',
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteExpense(id);
      return id;
    } catch (err) {
      return rejectWithValue((err as any).message || 'Error al eliminar gasto');
    }
  }
);

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const convertedExpenses = action.payload.expenses.map(convertApiExpenseToExpense);
        if (action.meta.arg.limit && (!action.meta.arg.page || action.meta.arg.page === 1)) {
          state.recentItems = convertedExpenses;
        } else {
          state.items = convertedExpenses;
        }
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Unknown error occurred';
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.items.findIndex(expense => expense.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.items = state.items.filter(expense => expense.id !== action.payload);
      });
  },
});

export default expensesSlice.reducer;