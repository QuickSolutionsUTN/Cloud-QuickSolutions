import React from 'react';
import './homePage.css';
import '../index.css'
import Carousel from '../components/main/Carousel';
import { NavLink } from 'react-router-dom';

export default function HomePage() {
  return (
    <main>
      <Carousel/>
      <div className='light-mode tertiary' id='maintenance-more-info'>
        <h1>SERVICIO DE MANTENIMIENTO</h1>
        <h2> Como funciona?</h2>
        <p> 
          Realizamos tareas de mantenimiento preventivo de una gran variedad de equipos y maquinarias,
          con el objetivo de prevenir fallas y alargar la vida útil de los mismos. Usted realiza una solicitud,
          nosotros recibimos el equipo/maquinaria y realizamos el mantenimiento necesario.<br/><br/>
        </p>  
        <h2>Como solicitarlo?</h2>
        <p>
          Haciendo click en el boton de abajo y completando el formulario de solicitud.
        </p>
        <NavLink to="/requests?type=maintenance" className='outlined-tertiary'>
          Solicitar mantenimiento
        </NavLink>
      </div>
      <div className='light-mode primary' id='repair-more-info'>
        <h1>SERVICIO DE REPARACIÓN</h1>
        <h2> Como funciona?</h2>
        <p>
          Realizamos tareas de reparación de una gran variedad de equipos y maquinarias. Usted realiza la solicitud,
          nosotros recibimos el equipo/maquinaria y realizamos un checkeo y presupuesto. Una vez aprobado el presupuesto
          realizamos el trabajo.<br/><br/>
        </p>
        <h2>Como solicitarlo?</h2>
        <p>
          Haciendo click en el boton de abajo y completando el formulario de solicitud.
        </p>
        <NavLink to="/requests?type=repair" className='outlined-tertiary'>
          Solicitar reparación
        </NavLink>
      </div>
    </main>
);
}