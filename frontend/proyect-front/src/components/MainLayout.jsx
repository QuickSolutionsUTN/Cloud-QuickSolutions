import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';

import TopNavbar from './TopNavbar.jsx';
import LoginButton from './LoginButton.jsx';
import LogoutButton from './LogoutButton.jsx';
import logo from '../assets/images/logo.png';
import LoginForm from './ModalLoginForm.jsx';

import AuthContext from '../contexts/AuthContext.jsx';

function MainLayout() {
  const location = useLocation();
  const { isAuthenticated, logout, login } = useContext(AuthContext);
  const [showLoginForm, setShowLoginForm] = React.useState(false);

  const handleLoginClick = () => {
    setShowLoginForm(true);
    console.log("Clickeo iniciar sesion");
  };

  const handleLoginClose = () => {
    setShowLoginForm(false);
    console.log("Clickeo cerrar sesion");
  };

  const handleLoginSubmit = (data, userRole) => {
    console.log("Clickeo iniciar sesion en modal");
    login(userRole);
    setShowLoginForm(false);
  };

  const handleLogoutClick = () => {
    logout();
    console.log("Clickeo cerrar sesion");
  };

  return (
    <>
      {location.pathname !== '/admin' && location.pathname !== '/maintenance' && (
        <>
          <header>
            {isAuthenticated ? (
              <LogoutButton onLogoutClick={handleLogoutClick} className="login-button" />
            ) : (
              <LoginButton onLoginClick={handleLoginClick} className="login-button" />
            )}
          </header>
          <div className='logo'>
            <img src={logo} alt="Logo" />
          </div>
          <TopNavbar />
        </>
      )}
      {showLoginForm && <LoginForm
        show={showLoginForm}
        onClose={handleLoginClose}
        onSubmit={handleLoginSubmit} />
      }
    </>
  );
}

export default MainLayout;