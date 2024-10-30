import React, { useContext } from 'react';
//import { Routes, Route, Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './adminLayout.css';
import AuthContext from '../contexts/AuthContext.jsx';
import AsideBar from '../components/admin/AdminsideBar.jsx';
//import AdminMaintenance from '../components/admin/AdminMaintenance.jsx';
//import AdminCatalog from '../components/admin/AdminCatalog.jsx';
//import AdminUsers from '../components/admin/AdminUsers.jsx';

function AdminLayout() {
  const { username } = useContext(AuthContext);

  return (
    <>
      <header className="admin-header">
        <p className="admin-p">Bienvenido, {username}</p>
      </header>
      <AsideBar className="admin-aside"/>
    </>
  );
}
export default AdminLayout;