// src/store/slices/categoriesSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
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
}

const initialState: CategoriesState = {
  categories: [],
  subcategories: [],
  status: 'idle',
  error: null
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const categoriesResponse = await api.getCategories();
    const subcategoriesResponse = await api.getSubcategories();
    return {
      categories: categoriesResponse.data,
      subcategories: subcategoriesResponse.data
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
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<{categories: Category[], subcategories: Subcategory[]}>) => {
        state.status = 'succeeded';
        state.categories = action.payload.categories;
        state.subcategories = action.payload.subcategories;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export default categoriesSlice.reducer;