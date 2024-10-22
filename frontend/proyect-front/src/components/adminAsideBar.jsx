import React from 'react';
import { Link } from 'react-router-dom';
import './adminAsideBar.css';

const AdminAsideBar = () => {
    return (
        <aside className="admin-aside-bar">
            <nav>
                <ul>
                    <li><h6>Solicitudes</h6></li>
                    <li><Link to="/admin/rent">  de alquiler</Link></li>
                    <li><Link to="/admin/maintenance"> de mantenimiento</Link></li>
                    <li><h6>Administracion</h6></li>
                    <li><Link to="/admin/catalog"> de catalogo</Link></li>
                    <li><Link to="/admin/catalog"> de usuarios</Link></li>
                </ul>
            </nav>
        </aside>
    );
};

export default AdminAsideBar;