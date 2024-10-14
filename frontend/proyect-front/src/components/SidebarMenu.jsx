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
          <Nav.Link as={Link} to="/" className="text-white">Home</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/about" className="text-white">About</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/contact" className="text-white">Contact</Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default CustomSidebarMenu;