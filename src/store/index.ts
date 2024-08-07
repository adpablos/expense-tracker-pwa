import { configureStore } from '@reduxjs/toolkit';

import categoriesReducer from './slices/categoriesSlice';
import expensesReducer from './slices/expensesSlice';

export const store = configureStore({
  reducer: {
    expenses: expensesReducer,
    categories: categoriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
