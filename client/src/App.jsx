// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/loginPage';
import AdminDashboard from './pages/adminPages/AdminDashboard';
import UserHome from './pages/userPages/UserHome';

// Component bảo vệ (Bạn tạo file PrivateRoute.jsx rồi import vào đây)
// Nếu chưa có file PrivateRoute, hãy tạo nó trong folder components
import PrivateRoute from './components/PrivateRoutes';

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ADMIN ROUTE (Role = 1) */}
      <Route 
        path="/admin/dashboard" 
        element={
          <PrivateRoute allowedRoles={[1]}>
            <AdminDashboard />
          </PrivateRoute>
        } 
      />

      {/* USER ROUTE (Role = 2) */}
      <Route 
        path="/user/home" 
        element={
          <PrivateRoute allowedRoles={[2]}>
            <UserHome />
          </PrivateRoute>
        } 
      />
      
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;