import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import firewallReducer from './slices/firewallSlice';
import vpnReducer from './slices/vpnSlice';
import networkReducer from './slices/networkSlice';
import systemReducer from './slices/systemSlice';
import usersReducer from './slices/usersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    firewall: firewallReducer,
    vpn: vpnReducer,
    network: networkReducer,
    system: systemReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;