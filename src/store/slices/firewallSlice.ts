import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Rule {
  id: string;
  action: 'allow' | 'block' | 'reject';
  protocol: 'any' | 'tcp' | 'udp' | 'icmp';
  source: string;
  destination: string;
  sourcePort: string;
  destinationPort: string;
  description: string;
  enabled: boolean;
}

interface FirewallState {
  rules: Rule[];
  loading: boolean;
  error: string | null;
}

const initialState: FirewallState = {
  rules: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchRules = createAsyncThunk('firewall/fetchRules', async (_, { rejectWithValue }) => {
  try {
    // Bu kısımda gerçek API çağrısı yapılacak
    // Şimdilik mock bir yanıt dönüyoruz
    // const response = await axios.get('/api/firewall/rules');
    // return response.data;
    
    // Mock response
    return [
      {
        id: '1',
        action: 'allow',
        protocol: 'tcp',
        source: 'any',
        destination: '192.168.1.1',
        sourcePort: 'any',
        destinationPort: '443',
        description: 'Allow HTTPS to pfSense',
        enabled: true,
      },
      {
        id: '2',
        action: 'block',
        protocol: 'any',
        source: '192.168.1.0/24',
        destination: '10.0.0.0/8',
        sourcePort: 'any',
        destinationPort: 'any',
        description: 'Block LAN to private networks',
        enabled: true,
      },
    ] as Rule[];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || 'Kurallar alınamadı');
    }
    return rejectWithValue('Kurallar alınamadı');
  }
});

export const addRule = createAsyncThunk(
  'firewall/addRule',
  async (rule: Omit<Rule, 'id'>, { rejectWithValue }) => {
    try {
      // Bu kısımda gerçek API çağrısı yapılacak
      // Şimdilik mock bir yanıt dönüyoruz
      // const response = await axios.post('/api/firewall/rules', rule);
      // return response.data;
      
      // Mock response
      return {
        ...rule,
        id: Math.random().toString(36).substring(2, 9),
      } as Rule;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Kural eklenemedi');
      }
      return rejectWithValue('Kural eklenemedi');
    }
  }
);

export const updateRule = createAsyncThunk(
  'firewall/updateRule',
  async (rule: Rule, { rejectWithValue }) => {
    try {
      // Bu kısımda gerçek API çağrısı yapılacak
      // Şimdilik mock bir yanıt dönüyoruz
      // const response = await axios.put(`/api/firewall/rules/${rule.id}`, rule);
      // return response.data;
      
      // Mock response
      return rule;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Kural güncellenemedi');
      }
      return rejectWithValue('Kural güncellenemedi');
    }
  }
);

export const deleteRule = createAsyncThunk(
  'firewall/deleteRule',
  async (id: string, { rejectWithValue }) => {
    try {
      // Bu kısımda gerçek API çağrısı yapılacak
      // Şimdilik mock bir yanıt dönüyoruz
      // await axios.delete(`/api/firewall/rules/${id}`);
      
      // Mock response
      return id;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Kural silinemedi');
      }
      return rejectWithValue('Kural silinemedi');
    }
  }
);

const firewallSlice = createSlice({
  name: 'firewall',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRules.fulfilled, (state, action: PayloadAction<Rule[]>) => {
        state.loading = false;
        state.rules = action.payload;
      })
      .addCase(fetchRules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addRule.fulfilled, (state, action: PayloadAction<Rule>) => {
        state.rules.push(action.payload);
      })
      .addCase(updateRule.fulfilled, (state, action: PayloadAction<Rule>) => {
        const index = state.rules.findIndex((rule) => rule.id === action.payload.id);
        if (index !== -1) {
          state.rules[index] = action.payload;
        }
      })
      .addCase(deleteRule.fulfilled, (state, action: PayloadAction<string>) => {
        state.rules = state.rules.filter((rule) => rule.id !== action.payload);
      });
  },
});

export const { clearError } = firewallSlice.actions;
export default firewallSlice.reducer;