import React, { useContext, useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import '../styles/MainLayout.css';
import AuthContext from '../contexts/AuthContext.jsx';

import TopNavbar from '../components/main/TopNavbar.jsx';
import LoginForm from '../components/ModalLoginForm.jsx';




function MainLayout() {
  //const location = useLocation();
  const { isAuthenticated, logout, login } = useContext(AuthContext);
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleLoginClick = () => {
    setShowLoginForm(true);
    console.log("Clickeo iniciar sesion");

  };

  const handleLoginClose = () => {
    setShowLoginForm(false);
    console.log("Clickeo cerrar sesion");
  };

  /*const handleLoginSubmit = (data) => {
    console.log("Clickeo iniciar sesion en modal");
    setShowLoginForm(false);
  };*/

  const handleLogoutClick = () => {
    logout();
    console.log("Clickeo cerrar sesion");
  };

  return (
    <>
      <header>
        <TopNavbar
          isAuthenticated={isAuthenticated}
          onLoginClick={handleLoginClick}
          onLogoutClick={handleLogoutClick}
        />
      </header>
      {showLoginForm && (
        <LoginForm
          show={showLoginForm}
          onClose={handleLoginClose}
        />
      )}
      <main>
        <Outlet /> {/*Para renderizarán las rutas hijas */}
      </main>
    </>
  );
}

export default MainLayout;