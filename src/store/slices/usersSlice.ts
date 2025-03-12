import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: 'admin' | 'user' | 'readonly';
  enabled: boolean;
  lastLogin: string;
}

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    // Bu kısımda gerçek API çağrısı yapılacak
    // Şimdilik mock bir yanıt dönüyoruz
    // const response = await axios.get('/api/users');
    // return response.data;
    
    // Mock response
    return [
      {
        id: '1',
        username: 'admin',
        fullName: 'Sistem Yöneticisi',
        email: 'admin@example.com',
        role: 'admin',
        enabled: true,
        lastLogin: '2023-03-15 14:30:00',
      },
      {
        id: '2',
        username: 'user1',
        fullName: 'Test Kullanıcısı',
        email: 'user1@example.com',
        role: 'user',
        enabled: true,
        lastLogin: '2023-03-14 09:15:00',
      },
      {
        id: '3',
        username: 'readonly',
        fullName: 'İzleyici Kullanıcı',
        email: 'readonly@example.com',
        role: 'readonly',
        enabled: false,
        lastLogin: '2023-02-28 16:45:00',
      },
    ] as User[];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || 'Kullanıcılar alınamadı');
    }
    return rejectWithValue('Kullanıcılar alınamadı');
  }
});

export const addUser = createAsyncThunk(
  'users/addUser',
  async (user: Omit<User, 'id' | 'lastLogin'>, { rejectWithValue }) => {
    try {
      // Bu kısımda gerçek API çağrısı yapılacak
      // Şimdilik mock bir yanıt dönüyoruz
      // const response = await axios.post('/api/users', user);
      // return response.data;
      
      // Mock response
      return {
        ...user,
        id: Math.random().toString(36).substring(2, 9),
        lastLogin: 'Hiç giriş yapılmadı',
      } as User;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Kullanıcı eklenemedi');
      }
      return rejectWithValue('Kullanıcı eklenemedi');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (user: User, { rejectWithValue }) => {
    try {
      // Bu kısımda gerçek API çağrısı yapılacak
      // Şimdilik mock bir yanıt dönüyoruz
      // const response = await axios.put(`/api/users/${user.id}`, user);
      // return response.data;
      
      // Mock response
      return user;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Kullanıcı güncellenemedi');
      }
      return rejectWithValue('Kullanıcı güncellenemedi');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: string, { rejectWithValue }) => {
    try {
      // Bu kısımda gerçek API çağrısı yapılacak
      // Şimdilik mock bir yanıt dönüyoruz
      // await axios.delete(`/api/users/${id}`);
      
      // Mock response
      return id;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Kullanıcı silinemedi');
      }
      return rejectWithValue('Kullanıcı silinemedi');
    }
  }
);

export const toggleUserStatus = createAsyncThunk(
  'users/toggleUserStatus',
  async ({ id, enabled }: { id: string; enabled: boolean }, { rejectWithValue }) => {
    try {
      // Bu kısımda gerçek API çağrısı yapılacak
      // Şimdilik mock bir yanıt dönüyoruz
      // const response = await axios.patch(`/api/users/${id}/toggle`, { enabled });
      // return response.data;
      
      // Mock response
      return { id, enabled };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Kullanıcı durumu değiştirilemedi');
      }
      return rejectWithValue('Kullanıcı durumu değiştirilemedi');
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(toggleUserStatus.fulfilled, (state, action: PayloadAction<{ id: string; enabled: boolean }>) => {
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index].enabled = action.payload.enabled;
        }
      });
  },
});

export const { clearError } = usersSlice.actions;
export default usersSlice.reducer;