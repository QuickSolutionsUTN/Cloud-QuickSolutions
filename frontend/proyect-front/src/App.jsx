import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout.jsx';
import AdminLayout from './layout/AdminLayout.jsx';
import RepairsRequest from './pages/RequestPage.jsx';
import HomePage from './pages/HomePage.jsx';
import AuthContext, { AuthProvider } from './contexts/AuthContext.jsx';
import MaintenancesPage from './pages/MaintenancesPage.jsx';
import AdminRequests from '../src/components/admin/adminRequests.jsx';
import RequestDetailsPage from './pages/RequestDetailsPage.jsx';
import UserRequestsPage from './pages/UserRequestsPage.jsx';
import UserProfilePage from './pages/UserProfilePage.jsx';
import RequestManagement from '../src/components/admin/RequestManagement.jsx';
import AdminCatalog from './pages/AdminCatalogPage.jsx';

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
            <Route path="requests" element={<RepairsRequest />} />
            <Route path="users">
              <Route path="profile" element={<UserProfilePage />} />
              <Route path="requests" element={<UserRequestsPage />} />
              <Route path="requests/:id" element={<RequestDetailsPage />} />
            </Route>
          </Route>
          <Route path="admin/*" element={<ProtectedRoute roleRequired="admin"><AdminLayout /></ProtectedRoute>}>
            <Route path="requests" element={<AdminRequests />} />
            <Route path="requests/:id" element={<RequestManagement />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;