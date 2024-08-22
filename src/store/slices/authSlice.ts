import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import * as api from '../../services/api';
import { setToken, removeToken } from '../../services/authService';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

interface AuthInfo {
  user: User;
  token: string;
}

interface RegisterData {
  name: string;
  email: string;
  auth_provider_id: string;
}

interface UpdateProfileData {
  name: string;
  email: string;
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: 'idle',
  error: null,
};

export const setAuthInfo = createAsyncThunk('auth/setAuthInfo', async (authInfo: AuthInfo) => {
  setToken(authInfo.token);
  return authInfo;
});

export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await api.register(userData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        // Si es un error de Axios con una respuesta
        return rejectWithValue(error.response.data);
      } else if (error instanceof Error) {
        // Si es un error general de JavaScript
        return rejectWithValue(error.message);
      }
      // Si no es ninguno de los anteriores, devolvemos un mensaje genérico
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData: UpdateProfileData, { rejectWithValue }) => {
    try {
      const response = await api.updateProfile(userData);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      } else if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      removeToken();
    },
    updateUserState: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    updateTokenState: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setAuthInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(setAuthInfo.fulfilled, (state, action: PayloadAction<AuthInfo>) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(setAuthInfo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to set auth info';
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        setToken(action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Registration failed';
      })
      .addCase(updateProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to update profile';
      });
  },
});

export const { logout, updateUserState, updateTokenState } = authSlice.actions;
export default authSlice.reducer;
