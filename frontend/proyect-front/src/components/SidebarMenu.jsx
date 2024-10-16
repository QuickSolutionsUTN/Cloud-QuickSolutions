import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/SidebarMenu.css';


const CustomSidebarMenu = () => {
  return (
    <div className="sidebar bg-dark text-white p-3">
      <h4>Menu</h4>
      <Nav className="flex-column">
        <Nav.Item>
          <Nav.Link as={Link} to="/" className="text-white">Inicio</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/equipos" className="text-white">Equipos</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/solicitudes_alq" className="text-white">Solicitudes de alquiler</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/solicitudes_rev" className="text-white">Solicitudes de revision</Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default CustomSidebarMenu;