import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/SidebarMenu.css';


const CustomSidebarMenu = () => {
  return (
    <div className="sidebar p-3">
      <h4>Sidebar Menu</h4>
      <Nav className="flex-column">
        <Nav.Item>
          <Nav.Link as={Link} to="/">Home</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/about">About</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default CustomSidebarMenu;