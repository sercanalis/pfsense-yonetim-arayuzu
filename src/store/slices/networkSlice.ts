import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Interface {
  id: string;
  name: string;
  type: 'LAN' | 'WAN' | 'OPT';
  ipAddress: string;
  subnet: string;
  gateway: string;
  status: 'up' | 'down';
  mac: string;
  mtu: number;
  enabled: boolean;
}

interface NetworkState {
  interfaces: Interface[];
  loading: boolean;
  error: string | null;
}

const initialState: NetworkState = {
  interfaces: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchInterfaces = createAsyncThunk('network/fetchInterfaces', async (_, { rejectWithValue }) => {
  try {
    // Bu kısımda gerçek API çağrısı yapılacak
    // Şimdilik mock bir yanıt dönüyoruz
    // const response = await axios.get('/api/network/interfaces');
    // return response.data;
    
    // Mock response
    return [
      {
        id: '1',
        name: 'WAN',
        type: 'WAN',
        ipAddress: '203.0.113.1',
        subnet: '255.255.255.0',
        gateway: '203.0.113.254',
        status: 'up',
        mac: '00:11:22:33:44:55',
        mtu: 1500,
        enabled: true,
      },
      {
        id: '2',
        name: 'LAN',
        type: 'LAN',
        ipAddress: '192.168.1.1',
        subnet: '255.255.255.0',
        gateway: '',
        status: 'up',
        mac: '00:11:22:33:44:56',
        mtu: 1500,
        enabled: true,
      },
      {
        id: '3',
        name: 'OPT1',
        type: 'OPT',
        ipAddress: '10.0.0.1',
        subnet: '255.255.255.0',
        gateway: '',
        status: 'down',
        mac: '00:11:22:33:44:57',
        mtu: 1500,
        enabled: false,
      },
    ] as Interface[];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || 'Ağ arayüzleri alınamadı');
    }
    return rejectWithValue('Ağ arayüzleri alınamadı');
  }
});

export const updateInterface = createAsyncThunk(
  'network/updateInterface',
  async (networkInterface: Interface, { rejectWithValue }) => {
    try {
      // Bu kısımda gerçek API çağrısı yapılacak
      // Şimdilik mock bir yanıt dönüyoruz
      // const response = await axios.put(`/api/network/interfaces/${networkInterface.id}`, networkInterface);
      // return response.data;
      
      // Mock response
      return networkInterface;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Ağ arayüzü güncellenemedi');
      }
      return rejectWithValue('Ağ arayüzü güncellenemedi');
    }
  }
);

export const toggleInterface = createAsyncThunk(
  'network/toggleInterface',
  async ({ id, enabled }: { id: string; enabled: boolean }, { rejectWithValue }) => {
    try {
      // Bu kısımda gerçek API çağrısı yapılacak
      // Şimdilik mock bir yanıt dönüyoruz
      // const response = await axios.patch(`/api/network/interfaces/${id}/toggle`, { enabled });
      // return response.data;
      
      // Mock response
      return { id, enabled };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Ağ arayüzü durumu değiştirilemedi');
      }
      return rejectWithValue('Ağ arayüzü durumu değiştirilemedi');
    }
  }
);

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInterfaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterfaces.fulfilled, (state, action: PayloadAction<Interface[]>) => {
        state.loading = false;
        state.interfaces = action.payload;
      })
      .addCase(fetchInterfaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateInterface.fulfilled, (state, action: PayloadAction<Interface>) => {
        const index = state.interfaces.findIndex((iface) => iface.id === action.payload.id);
        if (index !== -1) {
          state.interfaces[index] = action.payload;
        }
      })
      .addCase(toggleInterface.fulfilled, (state, action: PayloadAction<{ id: string; enabled: boolean }>) => {
        const index = state.interfaces.findIndex((iface) => iface.id === action.payload.id);
        if (index !== -1) {
          state.interfaces[index].enabled = action.payload.enabled;
          state.interfaces[index].status = action.payload.enabled ? 'up' : 'down';
        }
      });
  },
});

export const { clearError } = networkSlice.actions;
export default networkSlice.reducer;