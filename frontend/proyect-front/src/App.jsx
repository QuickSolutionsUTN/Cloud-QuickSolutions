import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import MainLayout from './layout/MainLayout.jsx';
import AdminLayout from './layout/AdminLayout.jsx';
import RepairsRequest from './pages/RequestPage.jsx';
import HomePage from './pages/HomePage.jsx';

import AuthContext, { AuthProvider } from './contexts/AuthContext.jsx';
import MaintenancesPage from './pages/MaintenancesPage.jsx';
import RepairsPage from './pages/RepairsPage.jsx';
import AboutUsPage from './pages/AboutUsPage.jsx';
import RequestDetailsPage from './pages/RequestDetailsPage.jsx';

function App() {
  const ProtectedRoute = ({ children, roleRequired }) => {
    const { isAuthenticated, userRole } = useContext(AuthContext);

    if (!isAuthenticated) {
      console.log("No validado");
      return <Navigate to="/" />;
    }
    if (userRole !== roleRequired) {
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
            <Route index element={<HomePage />} />
            <Route path="maintenance" element={<ProtectedRoute roleRequired="maintenance"><MaintenancesPage /></ProtectedRoute>} />
            <Route path="repairs" element={<RepairsPage />} />
            <Route path="requests" element={<RepairsRequest />} />
            <Route path="requests/:id" element={<RequestDetailsPage />} />
            <Route path="maintenances" element={<MaintenancesPage />} />
            <Route path="aboutUs" element={<AboutUsPage />} />
          </Route>
          <Route path="admin/*" element={<ProtectedRoute roleRequired="admin"><AdminLayout /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;