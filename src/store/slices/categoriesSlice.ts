import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

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

    // Asociar subcategorías con sus categorías correspondientes
    const categoriesWithSubcategories = categoriesResponse.data.map((category: Category) => ({
      ...category,
      subcategories: subcategoriesResponse.data.filter(
        (sub: Subcategory) => sub.categoryId === category.id
      ),
    }));

    return {
      categories: categoriesWithSubcategories,
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

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, name }: { id: string; name: string }) => {
    const response = await api.updateCategory(id, { name });
    return response.data;
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async ({ categoryId, force }: { categoryId: string; force?: boolean }, { rejectWithValue }) => {
    try {
      await api.deleteCategory(categoryId, force);
      return categoryId;
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data || error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const deleteSubcategory = createAsyncThunk(
  'categories/deleteSubcategory',
  async (
    { categoryId, subcategoryId }: { categoryId: string; subcategoryId: string },
    { rejectWithValue }
  ) => {
    try {
      await api.deleteSubcategory(subcategoryId);
      return { categoryId, subcategoryId };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateSubcategory = createAsyncThunk(
  'categories/updateSubcategory',
  async ({ id, name, categoryId }: { id: string; name: string; categoryId: string }) => {
    const response = await api.updateSubcategory(id, { name, categoryId });
    return response.data;
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
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(createSubcategory.fulfilled, (state, action) => {
        const category = state.categories.find((c) => c.id === action.payload.categoryId);
        if (category) {
          if (!category.subcategories) {
            category.subcategories = [];
          }
          category.subcategories.push(action.payload);
        }
      })
      .addCase(updateCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        const index = state.categories.findIndex((cat) => cat.id === action.payload.id);
        if (index !== -1) {
          const existingSubcategories = state.categories[index].subcategories;
          state.categories[index] = {
            ...action.payload,
            subcategories: existingSubcategories,
          };
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
      })
      .addCase(updateSubcategory.fulfilled, (state, action) => {
        const category = state.categories.find((c) => c.id === action.payload.categoryId);
        if (category) {
          const subcategoryIndex = category.subcategories.findIndex(
            (s) => s.id === action.payload.id
          );
          if (subcategoryIndex !== -1) {
            category.subcategories[subcategoryIndex] = action.payload;
          }
        }
      });
  },
});

export default categoriesSlice.reducer;
