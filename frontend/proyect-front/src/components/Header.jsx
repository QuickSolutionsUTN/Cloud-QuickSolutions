import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css'; // Importa el archivo de estilos
import {Dropdown} from 'react-bootstrap';
import {DropdownButton} from 'react-bootstrap';

const Header = () => {
  return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Mi Aplicación</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/">Inicio</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">Acerca de</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/services">Servicios</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">Contacto</Link>
              </li>
            </ul>
          </div>
        </div>
        <DropdownButton id="dropdown-basic-button" title="Iniciar sesion">
          <Dropdown.Item href="#/action-1">Cuenta</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Cerrar sesion</Dropdown.Item>
        </DropdownButton>
      </nav>
  );
};

export default Header;