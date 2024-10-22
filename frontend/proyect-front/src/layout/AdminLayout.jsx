import React, { useContext } from 'react';
import '../styles/adminLayout.css';
import AuthContext from '../contexts/AuthContext.jsx';

function AdminLayout() {
  const { username } = useContext(AuthContext);

  return (
      <p>Bienvenido, {username}</p>
  );
}

export default AdminLayout;