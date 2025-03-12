import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface SystemInfo {
  version: string;
  hostname: string;
  domain: string;
  uptime: string;
  cpu: {
    model: string;
    usage: number;
    temperature: number;
  };
  memory: {
    total: number;
    used: number;
    free: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
  };
}

interface Update {
  id: string;
  version: string;
  releaseDate: string;
  description: string;
  size: string;
  installed: boolean;
}

interface SystemState {
  info: SystemInfo | null;
  updates: Update[];
  loading: boolean;
  error: string | null;
}

const initialState: SystemState = {
  info: null,
  updates: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchSystemInfo = createAsyncThunk('system/fetchSystemInfo', async (_, { rejectWithValue }) => {
  try {
    // Bu kısımda gerçek API çağrısı yapılacak
    // Şimdilik mock bir yanıt dönüyoruz
    // const response = await axios.get('/api/system/info');
    // return response.data;
    
    // Mock response
    return {
      version: '2.7.0',
      hostname: 'pfsense',
      domain: 'local',
      uptime: '10 days, 5 hours, 30 minutes',
      cpu: {
        model: 'Intel(R) Core(TM) i5-7500 CPU @ 3.40GHz',
        usage: 15,
        temperature: 45,
      },
      memory: {
        total: 8192,
        used: 2048,
        free: 6144,
      },
      disk: {
        total: 120000,
        used: 25000,
        free: 95000,
      },
    } as SystemInfo;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || 'Sistem bilgileri alınamadı');
    }
    return rejectWithValue('Sistem bilgileri alınamadı');
  }
});

export const fetchUpdates = createAsyncThunk('system/fetchUpdates', async (_, { rejectWithValue }) => {
  try {
    // Bu kısımda gerçek API çağrısı yapılacak
    // Şimdilik mock bir yanıt dönüyoruz
    // const response = await axios.get('/api/system/updates');
    // return response.data;
    
    // Mock response
    return [
      {
        id: '1',
        version: '2.7.1',
        releaseDate: '2023-03-15',
        description: 'Güvenlik güncellemeleri ve hata düzeltmeleri',
        size: '25MB',
        installed: false,
      },
      {
        id: '2',
        version: '2.7.0',
        releaseDate: '2023-01-10',
        description: 'Mevcut sürüm',
        size: '120MB',
        installed: true,
      },
    ] as Update[];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || 'Güncellemeler alınamadı');
    }
    return rejectWithValue('Güncellemeler alınamadı');
  }
});

export const installUpdate = createAsyncThunk(
  'system/installUpdate',
  async (id: string, { rejectWithValue }) => {
    try {
      // Bu kısımda gerçek API çağrısı yapılacak
      // Şimdilik mock bir yanıt dönüyoruz
      // await axios.post(`/api/system/updates/${id}/install`);
      
      // Mock response
      return id;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Güncelleme yüklenemedi');
      }
      return rejectWithValue('Güncelleme yüklenemedi');
    }
  }
);

export const rebootSystem = createAsyncThunk('system/reboot', async (_, { rejectWithValue }) => {
  try {
    // Bu kısımda gerçek API çağrısı yapılacak
    // Şimdilik mock bir yanıt dönüyoruz
    // await axios.post('/api/system/reboot');
    
    // Mock response
    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || 'Sistem yeniden başlatılamadı');
    }
    return rejectWithValue('Sistem yeniden başlatılamadı');
  }
});

const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSystemInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSystemInfo.fulfilled, (state, action: PayloadAction<SystemInfo>) => {
        state.loading = false;
        state.info = action.payload;
      })
      .addCase(fetchSystemInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUpdates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpdates.fulfilled, (state, action: PayloadAction<Update[]>) => {
        state.loading = false;
        state.updates = action.payload;
      })
      .addCase(fetchUpdates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(installUpdate.fulfilled, (state, action: PayloadAction<string>) => {
        const updateIndex = state.updates.findIndex((update) => update.id === action.payload);
        if (updateIndex !== -1) {
          // Tüm güncellemeleri installed: false olarak işaretle
          state.updates.forEach((update) => {
            update.installed = false;
          });
          // Yeni güncellemeyi installed: true olarak işaretle
          state.updates[updateIndex].installed = true;
          
          // Sistem bilgisini güncelle
          if (state.info) {
            state.info.version = state.updates[updateIndex].version;
          }
        }
      });
  },
});

export const { clearError } = systemSlice.actions;
export default systemSlice.reducer;