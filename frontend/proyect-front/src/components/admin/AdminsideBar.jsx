import React from "react";
import { Nav } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import img_link from '../../assets/logos/logo_outlineWhite.png';
import './adminSideBar.css';

const AdminSideBar = () => {
  const navigate = useNavigate();
  const currentPath = '/admin';

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="title"><h5>Menu Admin</h5></div>
      </div>
      <Nav
        activeKey="/home"
        onSelect={selectedKey => {
          navigate(selectedKey);
        }}
      >
        <Nav.Item className="nav-item-section-title">
          <span className="title-section">Solicitudes</span>
        </Nav.Item>
        <Nav.Item className="nav-item">
          <Nav.Link onClick={() => navigate(`${currentPath}/requests`)}>Solicitudes</Nav.Link>
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
    </div>
  );
};

export default AdminSideBar;