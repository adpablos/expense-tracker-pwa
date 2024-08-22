import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import categoriesReducer from './slices/categoriesSlice';
import expensesReducer from './slices/expensesSlice';

export const store = configureStore({
  reducer: {
    expenses: expensesReducer,
    categories: categoriesReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
