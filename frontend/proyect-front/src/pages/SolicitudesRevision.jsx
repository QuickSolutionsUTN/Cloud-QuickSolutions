import React from 'react';
import ServiceCard from '../components/ServiceCard';
import '../styles/home.css'; 
import SolicitudesRevisionTable from '../components/SolicitudesRevTable';
//import Img1 from '../assets/images/equipos.png'; // Importa la imagen

const SolicitudesRevisionPage = () => {
  return (
    <section>
      <h2>Solicitudes de Revision</h2>
      <SolicitudesRevisionTable />
    </section>
  );
};

export default SolicitudesRevisionPage;