import React, { useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/adminLayout.css';
import AuthContext from '../contexts/AuthContext.jsx';
import AsideBar from '../components/AdminAsideBar.jsx';

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