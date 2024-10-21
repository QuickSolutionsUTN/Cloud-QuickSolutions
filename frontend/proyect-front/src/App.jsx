import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/app.css';

import MainLayout from './components/MainLayout.jsx';
import Catalog from './pages/Catalog.jsx';
import AdminPage from './pages/AdminPage.jsx';
import MaintenancePage from './pages/MaintenancePage.jsx';

function App() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [role, setRole] = useState(() => {
    return localStorage.getItem('role');
  });

  const handleLoginClick = () => {
    setShowLoginForm(true);
    console.log("Clickeo iniciar sesion");
  };

  const handleLoginClose = () => {
    setShowLoginForm(false);
    console.log("Clickeo cerrar sesion");
  };

  const handleLoginSubmit = (data, userRole) => {
    // SECCION PARA VALIDAR LAS CREDENCIALES Y OBTENER LOS ROLES
    console.log("Clickeo iniciar sesion en modal");
    setIsAuthenticated(true);
    setRole(userRole);
    setShowLoginForm(false);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('role', userRole);
  };

  const handleLogoutClick = () => {
    console.log("Clickeo cerrar sesion");
    setIsAuthenticated(false);
    setRole(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('role');
  };

  useEffect(() => {
    console.log("Estado: ", isAuthenticated);
    console.log("Rol: ", role);
  }, [isAuthenticated, role]);

  const ProtectedRoute = ({ children, roleRequired }) => {
    if (!isAuthenticated) {
      console.log("No validado");
      return <Navigate to="/" />;
    }
    if (role !== roleRequired) {
      console.log("No rol");
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <div>
      <Router>
        <MainLayout
          isAuthenticated={isAuthenticated}
          handleLoginClick={handleLoginClick}
          handleLogoutClick={handleLogoutClick}
          showLoginForm={showLoginForm}
          handleLoginClose={handleLoginClose}
          handleLoginSubmit={handleLoginSubmit}
        />
        <Routes>
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/admin" element={<ProtectedRoute roleRequired="admin"><AdminPage /></ProtectedRoute>} />
          <Route path="/maintenance" element={<ProtectedRoute roleRequired="maintenance"><MaintenancePage /></ProtectedRoute>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;