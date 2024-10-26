import React from "react";
import { Nav } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

const AdminSideBar = () => {
  const navigate = useNavigate();
  const currentPath = '/admin';

  return (
    <Nav
      className="admin-aside col-md-12 d-none d-md-block bg-light h-100"
      activeKey="/home"
      onSelect={selectedKey => {
        navigate(selectedKey);
      }}
    >
      <Nav.Item className="nav-item-section-title">
        <span className="title-section">Solicitudes</span>
      </Nav.Item>
      <Nav.Item className="nav-item">
        <Nav.Link onClick={() => navigate(`${currentPath}/rental`)}>de alquiler</Nav.Link>
      </Nav.Item>
      <Nav.Item className="nav-item">
        <Nav.Link onClick={() => navigate(`${currentPath}/maintenance`)}>de mantenimiento</Nav.Link>
      </Nav.Item>
      <Nav.Item className="nav-item-section-title">
        <span className="title-section">Administración</span>
      </Nav.Item>
      <Nav.Item className="nav-item">
        <Nav.Link onClick={() => navigate(`${currentPath}/catalog`)}>de catalogo</Nav.Link>
      </Nav.Item>
      <Nav.Item className="nav-item">
        <Nav.Link onClick={() => navigate(`${currentPath}/users`)}>de usuarios</Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default AdminSideBar;