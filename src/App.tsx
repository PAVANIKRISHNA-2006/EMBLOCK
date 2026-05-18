import {useEffect, useState} from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import People from './pages/People';
import Projects from './pages/Projects';
import KHub from './pages/KHub';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Admin from './pages/Admin';
import InternalBase from './pages/InternalBase';
import Workspace from './pages/Workspace';
import {AuthProvider, useAuth} from './context/AuthContext';

function AppRoutes() {
  const {user, profile} = useAuth();
  
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  if (!profile || !profile.isRegistered) {
    return (
      <Routes>
        <Route path="/register" element={<Registration />} />
        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    );
  }

  const isAdmin = profile?.isAdmin || user?.email === 'raokpavani@gmail.com';

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="people" element={<People />} />
        <Route path="projects" element={<Projects />} />
        <Route path="k-hub" element={<KHub />} />
        <Route path="internal-base" element={<InternalBase />} />
        <Route path="workspace/:id" element={<Workspace />} />
        <Route path="settings" element={<Settings />} />
        {isAdmin && <Route path="admin" element={<Admin />} />}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
