import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './features/auth/Login';
import Superadmin from './features/dashboard/Superadmin';
import StaffList from './features/staff/StaffList';
import Layout from './components/Layout'; 

export default function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('token') ? true : false;
  });

  const navigate = useNavigate();

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate('/'); 
  };

  return (
    <Routes>
      
      <Route 
        path="/login" 
        element={
          !isAuthenticated ? (
            <Login onLogin={handleLogin} />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />

      {/* PROTECTED ROUTES: Dashboard (Wrapped in Layout) */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            <Layout /> /* Layout contains Sidebar, Header, and Outlet */
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        {/* The 'index' route is what loads by default at path "/" */}
        <Route index element={<Superadmin />} />

        <Route path="/allstaffs" element={<StaffList />} />
      </Route>
    </Routes>
  );
}