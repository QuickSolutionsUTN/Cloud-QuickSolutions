import React, { useState, useContext } from 'react';
import { Outlet } from 'react-router-dom';

import './adminLayout.css';
import AuthContext from '../contexts/AuthContext.jsx';
import AsideBar from '../components/admin/AdminsideBar.jsx';
import UserMenu from '../components/UserMenu.jsx';
import user from '../assets/logos/user-white.png';
//import AdminMaintenance from '../components/admin/AdminMaintenance.jsx';
//import AdminCatalog from '../components/admin/AdminCatalog.jsx';
//import AdminUsers from '../components/admin/AdminUsers.jsx';

function AdminLayout() {
  const { username, logout, isAuthenticated, userRole } = useContext(AuthContext);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const onLogoutClick = () => {
    logout();
    console.log("Clickeo cerrar sesion");
  };
  return (
    <>
      <header className="admin-header">
        <p className="admin-p">Bienvenido, {username}</p>
        <div
          className="admin-user-menu-container"
          onMouseEnter={() => setShowUserMenu(true)}
        >
          <button className="user-btn"><img src={user} /></button>
          {showUserMenu && (
            <UserMenu
              onLogoutClick={onLogoutClick}
              onMouseLeave={() => setShowUserMenu(false)}
              role={userRole}
            />
          )}
        </div>
      </header>
      <div className="admin-layout container">
        <AsideBar className="admin-aside container" />
        < div className="admin-page-content container">
          <Outlet />
        </div>
      </div>
    </>
  );
}
export default AdminLayout;