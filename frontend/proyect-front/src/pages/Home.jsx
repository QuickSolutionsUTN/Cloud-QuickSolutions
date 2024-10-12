import React from 'react';
import Header from '../components/Header';
import SidebarMenu from '../components/SidebarMenu';
import ServiceCard from '../components/ServiceCard';
import '../styles/home.css'; // Archivo de estilos para Home

const Home = () => {
  return (
    <section>
      <h1>Bienvenido a la Página Principal</h1>
      <div className="row">
        <ServiceCard title="Servicio 1" description="Descripción del servicio 1" />
        <ServiceCard title="Servicio 2" description="Descripción del servicio 2" />
        <ServiceCard title="Servicio 3" description="Descripción del servicio 3" />
      </div>
    </section>
  );
};

export default Home;