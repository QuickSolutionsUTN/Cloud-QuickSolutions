import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout.jsx';
import AdminLayout from './layout/AdminLayout.jsx';
import RepairsRequest from './pages/RequestPage.jsx';
import HomePage from './pages/HomePage.jsx';
import AuthContext, { AuthProvider } from './contexts/AuthContext.jsx';
import AdminRequests from '../src/components/admin/adminRequests.jsx';
import RequestDetailsPage from './pages/RequestDetailsPage.jsx';
import UserRequestsPage from './pages/UserRequestsPage.jsx';
import UserProfilePage from './pages/UserProfilePage.jsx';
import RequestManagement from '../src/components/admin/RequestManagement.jsx';
import AdminProductsPage from './pages/AdminProductsPage.jsx';
import AdminCategoriesPage from './pages/AdminCategoriesPage.jsx';
import AdminUsersPage from './pages/AdminUsersPage.jsx';
import AdminMaintenancePage from './pages/AdminMaintenancePage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';

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
            <Route path="requests" element={<RepairsRequest />} />
            <Route path="users">
              <Route path="profile" element={<UserProfilePage />} />
              <Route path="requests" element={<UserRequestsPage />} />
              <Route path="requests/:id" element={<RequestDetailsPage />} />
            </Route>
          </Route>
          <Route path="admin/*" element={<ProtectedRoute roleRequired="admin"><AdminLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="requests" element={<AdminRequests />} />
            <Route path="requests/:id" element={<RequestManagement />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="maintenance" element={<AdminMaintenancePage />} />
            <Route path="users" element={<AdminUsersPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;