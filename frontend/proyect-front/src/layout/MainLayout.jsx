import React, { useContext, useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext.jsx';

import TopNavbar from '../components/main/TopNavbar.jsx';
import LoginForm from '../components/ModalLoginForm.jsx';
import ModalJoin from '../components/ModalJoin.jsx';




function MainLayout() {
  //const location = useLocation();
  const { isAuthenticated, logout, login } = useContext(AuthContext);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);

  const handleLoginClick = () => {
    setShowLoginForm(true);
    console.log("Clickeo iniciar sesion");

  };

  const handleLoginClose = () => {
    setShowLoginForm(false);
    console.log("Clickeo cerrar sesion");
  };

  const handleJoinClick = () => {
    setShowJoinForm(true);
    console.log("Clickeo registrarse");
  }

  /*const handleLoginSubmit = (data) => {
    console.log("Clickeo iniciar sesion en modal");
    setShowLoginForm(false);
  };*/
  const handleLoginToJoinClick = () => {
    setShowLoginForm(false);
    setShowJoinForm(true);
    console.log("Clickeo registrarse desde iniciar sesion");
  };

  const handleLogoutClick = () => {
    logout();
    console.log("Clickeo cerrar sesion");
  };
  
  const handleSwitchToLogin = () => {
    setShowJoinForm(false);
    setShowLoginForm(true);
  };

  return (
    <>
      <header>
        <TopNavbar
          isAuthenticated={isAuthenticated}
          onLoginClick={handleLoginClick}
          onLogoutClick={handleLogoutClick}
          onJoinClick={handleJoinClick}
        />
      </header>
      {showLoginForm && (
        <LoginForm
          show={showLoginForm}
          onClose={handleLoginClose}
          onJoinClick={handleLoginToJoinClick}
        />
      )}
      {showJoinForm && (
        <ModalJoin
          show={showJoinForm}
          onClose={() => setShowJoinForm(false)}
          onSwitchToLogin={handleSwitchToLogin}

        />
      )}
      <main>
        <Outlet /> {/*Para renderizarán las rutas hijas */}
      </main>
    </>
  );
}

export default MainLayout;