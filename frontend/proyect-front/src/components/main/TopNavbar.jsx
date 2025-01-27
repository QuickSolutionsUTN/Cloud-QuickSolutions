import React, { useState, useContext } from "react";
import "./topNavBar.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logos/logo.png";
import user from "../../assets/logos/user-orange.png";
import { refresh } from "../../utilities/refresh";
import DropDownCard from "./DropDownCard.jsx"
import UserMenu from "../UserMenu.jsx";
import AuthContext from "../../contexts/AuthContext.jsx";

export const TopNavbar = ({ onLoginClick, onJoinClick, onLogoutClick }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuOpen2, setMenuOpen2] = useState(false);
  const { isAuthenticated, userRole } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/'); // Redirige a la HomePage
  };

  return (
    <nav className="light-mode">
      <div className='logo' onClick={handleLogoClick}>
        <img src={logo} />
      </div>
      <div className="menu">
        <div
          className="dropdown"
          onMouseEnter={() => setMenuOpen(true)}
          onMouseLeave={() => setMenuOpen(false)}
        >
          <button className="dropbtn">Mantenimiento</button>
          {menuOpen && (
            <div className="dropdown-content">
              <NavLink to="/">
                <DropDownCard title="Que ofrecemos?" content="Servicio de mantenimiento etc" />
              </NavLink>
              <NavLink to="/requests">
                <DropDownCard title="Solicitar" content="Crea una solicitud para el mantenimiento de tu equipo" />
              </NavLink>
            </div>
          )}
        </div>
      </div>
      <div className="menu">
        <div
          className="dropdown"
          onMouseEnter={() => setMenuOpen2(true)}
          onMouseLeave={() => setMenuOpen2(false)}
        >
          <button className="dropbtn">Reparaciones</button>
          {menuOpen2 && (
            <div className="dropdown-content">
              <NavLink to="/">
                <DropDownCard title="Que ofrecemos?" content="Servicio de reparacion etc" />
              </NavLink>
              <NavLink to="/requests">
                <DropDownCard title="Solicitar" content="Crea una solicitud para la reparacion de tu equipo" />
              </NavLink>
            </div>
          )}
        </div>
      </div>
      <div className="buttons">
        {isAuthenticated ? (
          <div
            className="user-menu-container"
            onMouseEnter={() => setShowUserMenu(true)}
          >
            <button className="user-btn"><img src={user} /></button>
            {showUserMenu && (
              <UserMenu
                onLogoutClick={onLogoutClick}
                onMouseLeave={() => setShowUserMenu(false)}
                role={userRole}
              />
            )}
          </div>
        ) : (
          <>
            <button className="join-btn" onClick={onJoinClick}>Únete</button>
            <button className="auth-btn" onClick={onLoginClick}>Iniciar Sesión</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default TopNavbar;