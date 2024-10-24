import React, { useState , useEffect } from "react";
import "./topNavBar.css";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { refresh } from "../../utilities/refresh";
import DropDownCard from "./DropDownCard.jsx"

export const TopNavbar = ({ isAuthenticated, onLoginClick, onLogoutClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuOpen2, setMenuOpen2] = useState(false);

  useEffect(() => {
    refresh('logo'); // Pasa la clase 'logo' para que se recargue la página al hacer clic
  }, []);

  return (
    <nav>
      <div className='logo'>
        <img src={logo}/>
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
                <DropDownCard title="Que ofrecemos?" content="Servicio de mantenimiento etc"/>
              </NavLink>
              <NavLink to="/">
                <DropDownCard title="Solicitar" content="Crea una solicitud para el mantenimiento de tu equipo"/>
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
                <DropDownCard title="Que ofrecemos?" content="Servicio de reparacion etc"/>
              </NavLink>
              <NavLink to="/">
                <DropDownCard title="Solicitar" content="Crea una solicitud para la reparacion de tu equipo"/>
              </NavLink>
            </div>
          )}
        </div>
      </div>
      <div className="buttons">
        <button className="join-btn">Únete</button>
        {isAuthenticated ? (
          <button className="auth-btn" onClick={onLogoutClick}>Cerrar Sesión</button>
        ) : (
          <button className="auth-btn" onClick={onLoginClick}>Iniciar Sesión</button>
        )}
      </div>
    </nav>
  );
};

export default TopNavbar;