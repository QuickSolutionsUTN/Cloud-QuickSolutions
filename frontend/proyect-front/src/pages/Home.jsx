import React from 'react';
import ServiceCard from '../components/ServiceCard';
import '../styles/home.css'; 
//import Img1 from '../assets/images/equipos.png'; // Importa la imagen

const Home = () => {
  return (
    <section>
      <h1>Bienvenido a la Página Principal</h1>
      <div className="row">
        <ServiceCard title="Equipos" description="Descripción del servicio 1" imgSrc={''}/>
        <ServiceCard title="Servicio 2" description="Descripción del servicio 2" />
        <ServiceCard title="Servicio 3" description="Descripción del servicio 3" />
      </div>
    </section>
  );
};

export default Home;