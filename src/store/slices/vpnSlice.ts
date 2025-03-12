import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface VPNTunnel {
  id: string;
  name: string;
  type: 'OpenVPN' | 'WireGuard' | 'IPsec';
  status: 'active' | 'inactive' | 'error';
  localNetwork: string;
  remoteNetwork: string;
  description: string;
}

interface VPNState {
  tunnels: VPNTunnel[];
  loading: boolean;
  error: string | null;
}

const initialState: VPNState = {
  tunnels: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchTunnels = createAsyncThunk('vpn/fetchTunnels', async (_, { rejectWithValue }) => {
  try {
    // Bu kısımda gerçek API çağrısı yapılacak
    // Şimdilik mock bir yanıt dönüyoruz
    // const response = await axios.get('/api/vpn/tunnels');
    // return response.data;
    
    // Mock response
    return [
      {
        id: '1',
        name: 'Site-to-Site VPN',
        type: 'OpenVPN',
        status: 'active',
        localNetwork: '192.168.1.0/24',
        remoteNetwork: '10.0.0.0/24',
        description: 'Ana ofis ile şube bağlantısı',
      },
      {
        id: '2',
        name: 'Remote Access',
        type: 'WireGuard',
        status: 'active',
        localNetwork: '192.168.1.0/24',
        remoteNetwork: '10.10.10.0/24',
        description: 'Uzaktan çalışanlar için VPN',
      },
    ] as VPNTunnel[];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || 'VPN tünelleri alınamadı');
    }
    return rejectWithValue('VPN tünelleri alınamadı');
  }
});

export const addTunnel = createAsyncThunk(
  'vpn/addTunnel',
  async (tunnel: Omit<VPNTunnel, 'id'>, { rejectWithValue }) => {
    try {
      // Bu kısımda gerçek API çağrısı yapılacak
      // Şimdilik mock bir yanıt dönüyoruz
      // const response = await axios.post('/api/vpn/tunnels', tunnel);
      // return response.data;
      
      // Mock response
      return {
        ...tunnel,
        id: Math.random().toString(36).substring(2, 9),
      } as VPNTunnel;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'VPN tüneli eklenemedi');
      }
      return rejectWithValue('VPN tüneli eklenemedi');
    }
  }
);

export const updateTunnel = createAsyncThunk(
  'vpn/updateTunnel',
  async (tunnel: VPNTunnel, { rejectWithValue }) => {
    try {
      // Bu kısımda gerçek API çağrısı yapılacak
      // Şimdilik mock bir yanıt dönüyoruz
      // const response = await axios.put(`/api/vpn/tunnels/${tunnel.id}`, tunnel);
      // return response.data;
      
      // Mock response
      return tunnel;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'VPN tüneli güncellenemedi');
      }
      return rejectWithValue('VPN tüneli güncellenemedi');
    }
  }
);

export const deleteTunnel = createAsyncThunk(
  'vpn/deleteTunnel',
  async (id: string, { rejectWithValue }) => {
    try {
      // Bu kısımda gerçek API çağrısı yapılacak
      // Şimdilik mock bir yanıt dönüyoruz
      // await axios.delete(`/api/vpn/tunnels/${id}`);
      
      // Mock response
      return id;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'VPN tüneli silinemedi');
      }
      return rejectWithValue('VPN tüneli silinemedi');
    }
  }
);

const vpnSlice = createSlice({
  name: 'vpn',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTunnels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTunnels.fulfilled, (state, action: PayloadAction<VPNTunnel[]>) => {
        state.loading = false;
        state.tunnels = action.payload;
      })
      .addCase(fetchTunnels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addTunnel.fulfilled, (state, action: PayloadAction<VPNTunnel>) => {
        state.tunnels.push(action.payload);
      })
      .addCase(updateTunnel.fulfilled, (state, action: PayloadAction<VPNTunnel>) => {
        const index = state.tunnels.findIndex((tunnel) => tunnel.id === action.payload.id);
        if (index !== -1) {
          state.tunnels[index] = action.payload;
        }
      })
      .addCase(deleteTunnel.fulfilled, (state, action: PayloadAction<string>) => {
        state.tunnels = state.tunnels.filter((tunnel) => tunnel.id !== action.payload);
      });
  },
});

export const { clearError } = vpnSlice.actions;
export default vpnSlice.reducer;