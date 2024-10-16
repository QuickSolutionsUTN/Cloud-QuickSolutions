import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import SidebarMenu from './components/SidebarMenu'; 
import Footer from './components/Footer'; 
import Home from './pages/Home';
import EquiposPage from './pages/EquiposPage.jsx';
import SolicitudesAlquiler from './pages/SolicitudesAlquiler.jsx';
import SolicitudesRevision from './pages/SolicitudesRevision.jsx';
import TopNavbar from './components/TopNavbar.jsx';
import LoginButton from './components/LoginButton.jsx';
import LogoutButton from './components/LogoutButton.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/app.css';
import LoginForm from './components/LoginFormModal.jsx';

function App() {

  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginClick = () => {
    console.log("Login button clicked");
    setShowLoginForm(true);
    console.log("showLoginForm state:", showLoginForm);
  };
  
  const handleLoginClose = () => {
    console.log("Login form closed");
    setShowLoginForm(false);
    console.log("showLoginForm state:", showLoginForm);
  };

  const handleLoginSubmit = (data) => {
    console.log("Login data:", data);
    setIsAuthenticated(true);
    setShowLoginForm(false);
  };

  const handleLogoutClick = () => {
    console.log("Logout button clicked");
    setIsAuthenticated(false);
  };
  
  return (
    <div className="d-flex flex-column min-vh-100">
      <Router>
        <header className="p-header bg-dark p-2 d-flex justify-content-between">
          <TopNavbar />
          {isAuthenticated ? (
            <LogoutButton onLogoutClick={handleLogoutClick} />
          ) : (
            <LoginButton onLoginClick={handleLoginClick} />
          )}
        </header>

        <div className="row flex-grow-1">
          <aside className="p-sidebar bg-dark col-1">
            <SidebarMenu />
          </aside>

          <main className="col-11 p-3">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/equipos" element={<EquiposPage />} /> {/* Página de equipos */}
              <Route path="/solicitudes_alq" element={<SolicitudesAlquiler />} /> {/* Página de solicitudes de alquiler */}
              <Route path="/solicitudes_rev" element={<SolicitudesRevision />} /> {/* Página de solicitudes de revisión */}
            </Routes>
          </main>
          {showLoginForm && <LoginForm 
            show={showLoginForm} 
            onClose={handleLoginClose}
            onSubmit={handleLoginSubmit} />
          }
        </div>
      </Router>

      <Footer />
    </div>
  );
}

export default App
