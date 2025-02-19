import React, { useState } from "react";
import { Nav, Collapse } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { faThumbtack, faUser, faWrench, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './adminSideBar.css';
import { NavLink } from "react-router-dom";

const AdminSideBar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
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
            <FontAwesomeIcon icon={faThumbtack} className="icon" />
            <span className="title-section">Principal</span>
          </Nav.Item>
          <Nav.Item className="nav-item">
            <Nav.Link as={NavLink} to={`${currentPath}/requests`}>
              Solicitudes
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="nav-item-section-title">
            <FontAwesomeIcon icon={faWrench} className="icon" />
            <span className="title-section">Servicios y Productos</span>
          </Nav.Item>
          <Nav.Item className="nav-item">

            <Nav.Item className="nav-item-section-collpase" onClick={() => setOpen(!open)}>
              <FontAwesomeIcon icon={faPlus} className="icon-expand" />
              Categorias y Equipos</Nav.Item>
            <Collapse in={open} className="nav-collapse">
              <Nav.Item className="nav-item">
                <Nav.Link as={NavLink} to={`${currentPath}/products`}> Productos</Nav.Link>
                <Nav.Link as={NavLink} to={`${currentPath}/categories`}> Categorias</Nav.Link>
              </Nav.Item>
            </Collapse>
          </Nav.Item>
          <Nav.Item className="nav-item">
            <Nav.Link as={NavLink} to={`${currentPath}/maintenance`}> Mantenimiento</Nav.Link>
          </Nav.Item>
          <Nav.Item className="nav-item-section-title">
            <FontAwesomeIcon icon={faUser} className="icon" />
            <span className="title-section">Gestion de Usuarios</span>
          </Nav.Item>
          <Nav.Item className="nav-item">
            <Nav.Link as={NavLink} to={`${currentPath}/users`}> Usuarios</Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
    </>
  );
};

export default AdminSideBar;