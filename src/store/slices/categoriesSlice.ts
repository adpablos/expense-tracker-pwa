import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData: { name: string }) => {
    const response = await api.createCategory(categoryData);
    return response.data;
  }
);

export const createSubcategory = createAsyncThunk(
  'categories/createSubcategory',
  async ({ categoryId, name }: { categoryId: string; name: string }) => {
    const response = await api.createSubcategory({ categoryId, name });
    return response.data;
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (categoryId: string) => {
    await api.deleteCategory(categoryId);
    return categoryId;
  }
);

export const deleteSubcategory = createAsyncThunk(
  'categories/deleteSubcategory',
  async ({ categoryId, subcategoryId }: { categoryId: string; subcategoryId: string }) => {
    await api.deleteSubcategory(subcategoryId);
    return { categoryId, subcategoryId };
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ... (reducers existentes)
    builder
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(createSubcategory.fulfilled, (state, action) => {
        const category = state.categories.find((c) => c.id === action.payload.categoryId);
        if (category) {
          category.subcategories.push(action.payload);
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteSubcategory.fulfilled, (state, action) => {
        const category = state.categories.find((c) => c.id === action.payload.categoryId);
        if (category) {
          category.subcategories = category.subcategories.filter(
            (s) => s.id !== action.payload.subcategoryId
          );
        }
      });
  },
});

export default categoriesSlice.reducer;
