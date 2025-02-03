import React from "react";
import { Nav } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { faThumbtack, faUser, faWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import img_link from '../../assets/logos/logo_outlineWhite.png';
import './adminSideBar.css';

const AdminSideBar = () => {
  const navigate = useNavigate();
  const currentPath = '/admin';

  return (
    <>
      <div className="admin-sidebar-header border-bottom">
        <div className="title"><h5>Menu Admin</h5></div>
      </div>
      <div className="admin-sidebar-content">
        <Nav
          activeKey="/home"
          onSelect={selectedKey => {
            navigate(selectedKey);
          }}
        >
          <Nav.Item className="nav-item-section-title">
          <FontAwesomeIcon icon={faThumbtack}  className="icon" />
            <span className="title-section">Principal</span>
          </Nav.Item>
          <Nav.Item className="nav-item">
            <Nav.Link onClick={() => navigate(`${currentPath}/requests`)}>Solicitudes</Nav.Link>
          </Nav.Item>
          <Nav.Item className="nav-item-section-title">
          <FontAwesomeIcon icon={faWrench} className="icon"/>
            <span className="title-section">Servicios y Productos</span>
          </Nav.Item>
          <Nav.Item className="nav-item">
            <Nav.Link onClick={() => navigate(`${currentPath}/catalog`)}>Categorias y Equipos</Nav.Link>
          </Nav.Item>
          <Nav.Item className="nav-item">
            <Nav.Link onClick={() => navigate(`${currentPath}/catalog`)}>Mantenimiento</Nav.Link>
          </Nav.Item>
          <Nav.Item className="nav-item-section-title">
            <FontAwesomeIcon icon={faUser} className="icon" />
            <span className="title-section">Gestion de Usuarios</span>
          </Nav.Item>
          <Nav.Item className="nav-item">
            <Nav.Link onClick={() => navigate(`${currentPath}/users`)}>Usuarios</Nav.Link>
          </Nav.Item>
          <Nav.Item className="nav-item">
            <Nav.Link onClick={() => navigate(`${currentPath}/users`)}>Roles y Permisos</Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
    </>
  );
};

export default AdminSideBar;