import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Firewall from './pages/Firewall';
import VPN from './pages/VPN';
import Network from './pages/Network';
import System from './pages/System';
import Users from './pages/Users';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
      </Route>

      {/* Protected Routes */}
      <Route path="/" element={isAuthenticated ? <MainLayout /> : <Navigate to="/auth/login" />}>
        <Route index element={<Dashboard />} />
        <Route path="firewall" element={<Firewall />} />
        <Route path="vpn" element={<VPN />} />
        <Route path="network" element={<Network />} />
        <Route path="system" element={<System />} />
        <Route path="users" element={<Users />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;