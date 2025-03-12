import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
    try {
      // Bu kısımda gerçek API çağrısı yapılacak
      // Şimdilik mock bir yanıt dönüyoruz
      // const response = await axios.post('/api/auth/login', { username, password });
      // return response.data;
      
      // Mock response
      if (username === 'admin' && password === 'admin') {
        return {
          id: '1',
          username: 'admin',
          email: 'admin@example.com',
          role: 'admin',
        };
      }
      return rejectWithValue('Geçersiz kullanıcı adı veya şifre');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Giriş başarısız');
      }
      return rejectWithValue('Giriş başarısız');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  // Bu kısımda gerçek API çağrısı yapılacak
  // Şimdilik mock bir yanıt dönüyoruz
  // await axios.post('/api/auth/logout');
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;