import React from 'react';
import SideBarMenu from '../components/SideBarMenu'; 

function adminCatalog() {
  return (
    <div>
      <h2>Listado de equipos</h2>
      <SideBarMenu />
      {/* Contenido de la página de administración */}
    </div>
  );
}

export default adminCatalog;