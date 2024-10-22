import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/app.css';

import MainLayout from './layout/MainLayout.jsx';
import Catalog from './pages/CatalogPage.jsx';
import AdminLayout from './layout/AdminLayout.jsx';
import MaintenancePage from './pages/MaintenancePage.jsx';

import AuthContext, { AuthProvider } from './contexts/AuthContext.jsx';

function App() {
  const ProtectedRoute = ({ children, roleRequired }) => {
    const { isAuthenticated, role } = useContext(AuthContext);

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
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route path="catalog" element={<Catalog />} />
            <Route path="admin" element={<ProtectedRoute roleRequired="admin"><AdminLayout/></ProtectedRoute>} />
            <Route path="maintenance" element={<ProtectedRoute roleRequired="maintenance"><MaintenancePage /></ProtectedRoute>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;