import React from "react";
import { Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Side = () => {
    const navigate = useNavigate();

    return (
        <>
            <Nav
                className="admin-aside col-md-12 d-none d-md-block bg-light h-100"
                activeKey="/home"
                onSelect={selectedKey => {
                    alert(`selected ${selectedKey}`);
                    navigate(selectedKey);
                }}
            >
                <Nav.Item className="nav-item-section-title">
                    <span className="title-section">Solicitudes</span>
                </Nav.Item>
                <Nav.Item className="nav-item">
                    <Nav.Link href="/rental">de alquiler</Nav.Link>
                </Nav.Item>
                <Nav.Item className="nav-item">
                    <Nav.Link eventKey="/maintenance">de mantenimiento</Nav.Link>
                </Nav.Item>
                <Nav.Item className="nav-item-section-title">
                    <span className="title-section">Administración</span>
                </Nav.Item>
                <Nav.Item className="nav-item">
                    <Nav.Link eventKey="/catalog">de catalogo</Nav.Link>
                </Nav.Item>
                <Nav.Item className="nav-item">
                    <Nav.Link eventKey="/users">de usuarios</Nav.Link>
                </Nav.Item>
            </Nav>
        </>
    );
};

export default Side;