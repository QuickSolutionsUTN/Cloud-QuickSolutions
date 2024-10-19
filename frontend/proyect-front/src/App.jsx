import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Catalog from './pages/Catalog.jsx';
import TopNavbar from './components/TopNavbar.jsx';
import LoginButton from './components/LoginButton.jsx';
import LogoutButton from './components/LogoutButton.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/app.css';
import LoginForm from './components/ModalLoginForm.jsx';
import logo from './assets/images/logo.png';


function App() {

  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginClick = () => {
    console.log("Login button clicked");
    setIsAuthenticated(true);
    setShowLoginForm(true);
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
    <div>
      <Router>
        <header> 
          {isAuthenticated ? (
            <LogoutButton onLogoutClick={handleLogoutClick} className="login-button" />
          ) : (
            <LoginButton onLoginClick={handleLoginClick} className="login-button" />
          )}
        </header>
        <div className='logo'>
          <img src={logo}></img>
        </div>
        <TopNavbar/>
        {showLoginForm && <LoginForm 
          show={showLoginForm}  
          onClose={handleLoginClose}
          onSubmit={handleLoginSubmit} />
        }
        <Routes>
          <Route path="/catalog" element={<Catalog />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App
