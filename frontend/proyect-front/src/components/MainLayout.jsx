import React from 'react';
import { useLocation } from 'react-router-dom';
import TopNavbar from './TopNavbar.jsx';
import LoginButton from './LoginButton.jsx';
import LogoutButton from './LogoutButton.jsx';
import logo from '../assets/images/logo.png';
import LoginForm from './ModalLoginForm.jsx';

function MainLayout({ isAuthenticated, handleLoginClick, handleLogoutClick, showLoginForm, handleLoginClose, handleLoginSubmit }) {
  const location = useLocation();

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