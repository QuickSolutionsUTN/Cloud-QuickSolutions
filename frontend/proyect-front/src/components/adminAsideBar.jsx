import React from 'react';
import { Link } from 'react-router-dom';

const AdminAsideBar = () => {
    return (
        <aside className="admin-aside-bar">
            <nav>
                <ul>
                    <li className='li-title'>Solicitudes</li>
                    <li><Link to="/admin/rent">  de alquiler</Link></li>
                    <li><Link to="/admin/maintenance"> de mantenimiento</Link></li>
                    <li className='li-title'>Administracion</li>
                    <li><Link to="/admin/catalog"> de catalogo</Link></li>
                    <li><Link to="/admin/catalog"> de usuarios</Link></li>
                </ul>
            </nav>
        </aside>
    );
};

export default AdminAsideBar;