import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiCreateExpense } from '../../services/api';
import { Expense, ExpenseInput } from '../../types';


interface ExpensesState {
  items: Expense[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ExpensesState = {
  items: [],
  status: 'idle',
  error: null
};

export const createExpense = createAsyncThunk<Expense, ExpenseInput>(
  'expenses/createExpense',
  async (expenseData, { rejectWithValue }) => {
    try {
      console.log('Enviando datos al backend:', expenseData);
      const response = await apiCreateExpense(expenseData);
      console.log('Respuesta del backend:', response.data);
      return response.data;
    } catch (err) {
      console.error('Error al crear gasto:', err);
      return rejectWithValue((err as any).message || 'Error al crear gasto');
    }
  }
);

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createExpense.pending, (state) => {
        state.status = 'loading';
        console.log('Creando gasto...');
      })
      .addCase(createExpense.fulfilled, (state, action: PayloadAction<Expense>) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
        console.log('Gasto creado con éxito:', action.payload);
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Error desconocido';
        console.error('Error al crear gasto:', action.payload);
      });
  },
});

export default expensesSlice.reducer;