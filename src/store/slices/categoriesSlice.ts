import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import * as api from '../../services/api';

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

interface CategoriesState {
  categories: Category[];
  subcategories: Subcategory[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetched: number | null;
}

const initialState: CategoriesState = {
  categories: [],
  subcategories: [],
  status: 'idle',
  error: null,
  lastFetched: null,
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { getState }) => {
    const state = getState() as { categories: CategoriesState };

    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (
      state.categories.status === 'succeeded' &&
      state.categories.lastFetched &&
      now - state.categories.lastFetched < fiveMinutes
    ) {
      console.log('Using cached categories');
      return {
        categories: state.categories.categories,
        subcategories: state.categories.subcategories,
      };
    }

    console.log('Fetching categories from API');
    const categoriesResponse = await api.getCategories();
    const subcategoriesResponse = await api.getSubcategories();
    return {
      categories: categoriesResponse.data,
      subcategories: subcategoriesResponse.data,
    };
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
        console.log('Categories fetch started');
      })
      .addCase(
        fetchCategories.fulfilled,
        (
          state,
          action: PayloadAction<{ categories: Category[]; subcategories: Subcategory[] }>
        ) => {
          state.status = 'succeeded';
          state.categories = action.payload.categories;
          state.subcategories = action.payload.subcategories;
          state.lastFetched = Date.now();
          console.log('Categories fetch succeeded');
        }
      )
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
        console.log('Categories fetch failed', state.error);
      });
  },
});

export default categoriesSlice.reducer;
